from flask import Flask, request, jsonify
import google.generativeai as genai
from transformers import pipeline
import random

# ---------------------------------------------------------
# CONFIGURE GEMINI
# ---------------------------------------------------------
API_KEY = "AIzaSyDszeA0U_ULPAIRPwOFAZcKIfG9Z-41-y8"
genai.configure(api_key=API_KEY)
gemini = genai.GenerativeModel("gemini-2.5-flash")

# ---------------------------------------------------------
# LOAD MEDICAL MODELS
# ---------------------------------------------------------
ner_model = pipeline("ner", model="dslim/bert-base-NER", aggregation_strategy="simple")
bio_ner_model = pipeline("ner", model="d4data/biomedical-ner-all", aggregation_strategy="simple")

# ---------------------------------------------------------
# HELPERS
# ---------------------------------------------------------
def ask_gemini(prompt):
    response = gemini.generate_content(prompt)
    return response.text

def extract_entities(text):
    ents = ner_model(text) + bio_ner_model(text)
    return [{"word": e["word"], "entity": e["entity_group"]} for e in ents]

# ---------------------------------------------------------
# FLASK APP
# ---------------------------------------------------------
app = Flask(__name__)


# ---------------------------------------------------------
# API 1 — Get Initial Problem & Extract Entities
# ---------------------------------------------------------
@app.route("/initial-problem", methods=["POST"])
def initial_problem():
    data = request.json
    problem = data.get("problem", "")

    ents = extract_entities(problem)

    return jsonify({
        "problem": problem,
        "entities": ents
    })


# ---------------------------------------------------------
# API 2 — Get Next AI Question
# ---------------------------------------------------------
@app.route("/next-question", methods=["POST"])
def next_question():
    data = request.json
    history = data.get("history", "")
    entities = data.get("entities", [])

    entity_words = ", ".join([e["word"] for e in entities])

    prompt = f"""
You are an AI medical doctor performing pre-consultation.

Ask the next clinical question.
Rules:
- Total 15–20 questions
- Include examples in brackets
- Ask only ONE question
- No repetition

Conversation so far:
{history}

Detected medical keywords: {entity_words}
"""

    question = ask_gemini(prompt)
    return jsonify({"question": question})


# ---------------------------------------------------------
# API 3 — Extract Entities From Patient Answer
# ---------------------------------------------------------
@app.route("/extract-entities", methods=["POST"])
def extract_entities_api():
    data = request.json
    text = data.get("text", "")

    ents = extract_entities(text)
    return jsonify({"entities": ents})


# ---------------------------------------------------------
# API 4 — Generate Final Summary
# ---------------------------------------------------------
@app.route("/final-summary", methods=["POST"])
def final_summary():
    data = request.json

    info = data.get("info", {})
    conversation = data.get("conversation", "")
    entities = data.get("entities", [])
    reports_uploaded = data.get("reports_uploaded", False)

    sym_text = ", ".join([e["word"] for e in entities])

    prompt = f"""
You are a senior medical AI.

Generate a structured medical summary including:
- Case Summary
- Symptoms & Timeline
- Clinical History
- 5–8 Differential Diagnoses with probabilities summing to 100%
- Recommended Tests
- Urgency Level
- Specialist Recommendation
- Red Flags

--- BASIC INFO ---
{info}

--- ALL SYMPTOMS / KEYWORDS ---
{sym_text}

--- FULL INTERVIEW ---
{conversation}

--- REPORTS UPLOADED ---
{reports_uploaded}
"""

    summary = ask_gemini(prompt)

    return jsonify({"summary": summary})


# ---------------------------------------------------------
# START SERVER
# ---------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
