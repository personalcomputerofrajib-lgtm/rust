import speech_recognition as sr
import pyttsx3
import requests
import sqlite3
import time
import json

# QuantumGuard Intelligence Core (Python 3.10+)

class SentinelAI:
    def __init__(self):
        self.engine = pyttsx3.init()
        self.r = sr.Recognizer()
        self.api_url = "http://localhost:8080"
        self.db_path = "../qg-api/quantumguard.db"

    def speak(self, text):
        print(f"[AI] {text}")
        self.engine.say(text)
        self.engine.runAndWait()

    def analyze_anomalies(self):
        """Analyze SQLite logs for suspicious system spikes"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT cpu_usage, mem_usage FROM telemetry ORDER BY id DESC LIMIT 10")
            rows = cursor.fetchall()
            
            if not rows:
                return "READY"

            # Simple Anomaly Logic: Check for sustained high CPU
            avg_cpu = sum(r[0] for r in rows) / len(rows)
            if avg_cpu > 80:
                return "ANOMALY_DETECTED"
            return "NORMAL"
        except Exception as e:
            return f"ERROR: {e}"

    def listen_for_command(self):
        with sr.Microphone() as source:
            print("[AI] Sentinel Listening...")
            audio = self.r.listen(source)
            try:
                command = self.r.recognize_google(audio).lower()
                print(f"[AI] Heard: {command}")
                return command
            except:
                return None

    def process_command(self, command):
        if "scan" in command:
            self.speak("Initiating full system scan via Rust engine.")
            requests.post(f"{self.api_url}/scan")
        elif "status" in command:
            status = self.analyze_anomalies()
            self.speak(f"Current system status is {status}.")
        elif "network" in command:
            self.speak("Opening network matrix view.")
            # In a real app, this would signal the UI via WebSockets
        else:
            self.speak("Command not recognized.")

    def run(self):
        self.speak("QuantumGuard Intelligence Core online.")
        while True:
            # Perform periodic anomaly check
            status = self.analyze_anomalies()
            if status == "ANOMALY_DETECTED":
                self.speak("Warning: High CPU anomaly detected. Investigation suggested.")
            
            # Listen for triggers
            # cmd = self.listen_for_command()
            # if cmd: self.process_command(cmd)
            
            time.Sleep(10) # Log check interval

if __name__ == "__main__":
    ai = SentinelAI()
    ai.run()
