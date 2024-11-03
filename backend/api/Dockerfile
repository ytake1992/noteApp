FROM python:3.11
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["uvicorn", "main:app", "--host=0.0.0.0", "--port=5000", "--reload"]