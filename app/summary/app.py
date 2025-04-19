from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import heapq
import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration
import pdfplumber  # Replacing PyPDF2

# NLTK setup
nltk.download('punkt')
nltk.download('stopwords')
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize

app = Flask(__name__)
CORS(app)

# === PDF Text Extraction ===
def extract_text_from_pdf_file(file) -> str:
    """
    Extract text from an uploaded PDF file using pdfplumber.
    """
    print("Extracting PDF...")
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()

# === Extractive Summary ===
def preprocess_text(text: str):
    stop_words = set(stopwords.words('english'))
    sentences = sent_tokenize(text)
    clean_sentences = []

    for sentence in sentences:
        words = word_tokenize(sentence.lower())
        clean_words = [word for word in words if word.isalnum() and word not in stop_words]
        clean_sentences.append(" ".join(clean_words))

    return clean_sentences, sentences


def extractive_summary(text: str, percentage: int) -> str:
    clean_sentences, original_sentences = preprocess_text(text)
    if not clean_sentences:
        return ""

    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(clean_sentences)
    cosine_similarities = cosine_similarity(tfidf_matrix, tfidf_matrix)
    sentence_scores = cosine_similarities.sum(axis=1)
    
    total_sentences = len(original_sentences)
    num_sentences = max(1, total_sentences * percentage // 100)

    top_sentence_indices = heapq.nlargest(
        num_sentences,
        range(len(sentence_scores)),
        key=sentence_scores.take
    )
    summary = [original_sentences[i] for i in sorted(top_sentence_indices)]
    return " ".join(summary)

# === Abstractive Summary using T5 ===
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = T5ForConditionalGeneration.from_pretrained('t5-base').to(device)
tokenizer = T5Tokenizer.from_pretrained('t5-base')

def abstractive_summary(text: str, percentage: int) -> str:
    clean_text = text.strip().replace("\n", " ")
    if not clean_text:
        return ""

    total_words = len(clean_text.split())
    target_words = max(30, total_words * percentage // 100)

    prompt = f"summarize: {clean_text}"
    inputs = tokenizer.encode(prompt, return_tensors='pt', max_length=512, truncation=True).to(device)

    summary_ids = model.generate(
        inputs,
        min_length=target_words,
        max_length=target_words * 2,
        length_penalty=2.0,
        num_beams=4,
        early_stopping=True
    )

    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

# === Main API Route ===
@app.route("/summarize", methods=["POST"])
def summarize():
    try:
        method = request.form.get("method") or request.json.get("method")
        percentage = request.form.get("percentage") or request.json.get("percentage")

        if percentage is None or method is None:
            return jsonify({"error": "Missing required fields"}), 400

        percentage = int(percentage)

        if "file" in request.files:
            file = request.files["file"]
            text = extract_text_from_pdf_file(file)
        else:
            data = request.get_json()
            text = data.get("text", "").strip()

        if not text:
            return jsonify({"error": "Text is empty"}), 400

        if method == "extractive":
            summary = extractive_summary(text, percentage)
        elif method == "abstractive":
            summary = abstractive_summary(text, percentage)
        else:
            return jsonify({"error": "Invalid summarization method"}), 400

        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": f"Failed to summarize: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
