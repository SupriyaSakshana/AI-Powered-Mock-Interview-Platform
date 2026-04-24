!pip install openai

openai.api_key 

def generate_question(role):
    prompt = f"Generate 1 interview question for a {role} role."

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content


def evaluate_answer(answer):
    prompt = f"""
    Evaluate the following answer based on:
    - Clarity
    - Correctness
    - Confidence

    Give:
    - Score out of 10
    - Strengths
    - Improvements

    Answer: {answer}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content


