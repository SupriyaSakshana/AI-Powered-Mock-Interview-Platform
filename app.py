from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

from google import genai

# Load env variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found")

# Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)

# Flask app
app = Flask(__name__)
CORS(app)


# 🔹 Generate Interview Question
@app.route("/generate-question", methods=["POST"])
def generate_question():

    try:
        data = request.get_json()

        role = data.get("role", "Software Engineer")
        level = data.get("level", "Beginner")

        prompt = f"""
        Generate one interview question for:
        Role: {role}
        Experience Level: {level}

        Keep it professional and concise.
        """

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return jsonify({
            "question": response.text
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# 🔹 Evaluate Answer
@app.route("/evaluate-answer", methods=["POST"])
def evaluate_answer():

    try:
        data = request.get_json()

        question = data.get("question")
        answer = data.get("answer")

        if not question or not answer:
            return jsonify({
                "error": "Question and answer required"
            }), 400

        prompt = f"""
        You are an AI interviewer.

        Interview Question:
        {question}

        Candidate Answer:
        {answer}

        Evaluate the answer professionally.

        Give:
        1. Score out of 10
        2. Strengths
        3. Weaknesses
        4. Improvement tips
        """

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return jsonify({
            "feedback": response.text
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# 🔹 Home Route
@app.route("/")
def home():
    return jsonify({
        "status": "AI Mock Interview API Running"
    })


# 🔹 Run Server
if __name__ == "__main__":
    app.run(debug=True, port=5000)
