
from flask import Flask, request, Response, jsonify, send_from_directory
from flask_cors import CORS
import sys
import os
import dashscope
from dashscope import Generation
import json
from collections import defaultdict

app = Flask(__name__)
CORS(app)

# Initialize dashscope
dashscope.api_key = "sk-981ee789bce14e53a9a70068a71ee430"

# Store chat history per session
session_messages = defaultdict(list)
max_history = 10

def generate_response(messages):
    try:
        print(f"Generating response for messages: {messages}")
        response = Generation.call(
            model="qwen-max-0428",
            messages=messages,
            result_format='message',
            stream=True,
            temperature=0.8
        )
        return response
    except Exception as e:
        print(f"DashScope API Error: {str(e)}")
        raise Exception(f"DashScope API Error: {str(e)}")

@app.route('/api/chat', methods=['POST'])
def chat():
    print("Received request to /api/chat")
    try:
        data = request.json
        session_id = data.get('sessionId', 'default')
        user_message = data.get('message')
        
        if not user_message:
            print("Error: No message provided in request")
            return jsonify({'error': 'No message provided'}), 400

        # Get or initialize session messages
        messages = session_messages[session_id]
        messages.append({"role": "user", "content": user_message})

        # Keep history within limits
        if len(messages) > max_history * 2:
            messages = messages[-max_history * 2:]
        session_messages[session_id] = messages

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({'error': 'Invalid request format'}), 400

    def generate():
        full_reply = ""
        last_content = ""
        try:
            response = generate_response(messages)
            
            for chunk in response:
                if chunk.status_code == 200:
                    # Get new content
                    content = chunk.output.choices[0].message.get('content', '')
                    if content and content != last_content:
                        # Only send the new part of the content
                        new_content = content[len(last_content):]
                        if new_content:
                            yield f"data: {json.dumps({'content': new_content})}\n\n"
                            full_reply += new_content
                            last_content = content
            
            # Save assistant's message to history only after all chunks are processed
            if full_reply:
                messages.append({"role": "assistant", "content": full_reply})
                session_messages[session_id] = messages
            
        except Exception as e:
            error_msg = f"Error generating response: {str(e)}"
            print(error_msg)
            yield f"data: {json.dumps({'error': error_msg})}\n\n"

    return Response(generate(), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
