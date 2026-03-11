#!/bin/bash
# Script para rodar a aplicação PDM Viewer

echo "🚀 Iniciando setup do backend..."
cd backend

# Criar ambiente virtual se não existir
if [ ! -d "venv" ]; then
    python -m venv venv
fi

# Ativar ambiente virtual
source venv/Scripts/activate || source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Rodar migrações
python manage.py migrate

echo "✅ Backend pronto."

echo "🚀 Iniciando setup do frontend..."
cd ..
bun install # ou npm install

echo "---"
echo "Para rodar o sistema, você precisará de 3 terminais:"
echo "1. Backend: cd backend && source venv/bin/activate && python manage.py runserver"
echo "2. Frontend: bun dev"
echo "3. Celery (Worker): cd backend && source venv/bin/activate && celery -A config worker --loglevel=info"
echo "---"
echo "Certifique-se de que o Redis e o PostgreSQL estejam rodando se configurados no .env"
