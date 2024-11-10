FROM python:3.11
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

EXPOSE 5000

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "5000"]