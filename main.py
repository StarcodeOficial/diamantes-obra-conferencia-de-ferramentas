from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import json

app = Flask(__name__)
app.secret_key = "9b8cb573a2793de751beed13e669e72bb2a92b53ece6788a"

@app.route("/")
def index():
    return render_template("index.html")

# Rota para o processo de login
@app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]

    with open("data/users.json") as file:
        data = json.load(file)
        users = data.get("users")

        for key, value in users.items():
            if value["username"] == username and value["password"] == password:
                return redirect(url_for("home"))  # Redireciona com o nome de usuário na URL

    return redirect(url_for("index"))

# Rota para a página home com o nome de usuário na URL
@app.route("/home")
def home():
    return render_template("home.html")

@app.route('/pendencias', methods=['GET', 'POST'])
def pendencias():
    return render_template('pendencias.html')


@app.route("/ler_json_colaboradores")
def ler_json_colaboradores():
    try:
        with open("data/colaboradores.json") as file:
            data = json.load(file)
            return jsonify(data)  # Retorna o conteúdo do arquivo JSON como resposta JSON
    except FileNotFoundError:
        return "Arquivo não encontrado", 404
    
# Rota para atualizar o status do colaborador
@app.route('/atualizar_colaborador', methods=['POST'])
def atualizar_colaborador():
    data = request.get_json()
    codigo = data.get('codigo')
    novo_status = data.get('novoStatus')

    # Carregar o arquivo JSON externo
    with open('data/colaboradores.json', 'r') as json_file:
        colaboradores = json.load(json_file)

    if codigo in colaboradores['colaboradores']:
        colaboradores['colaboradores'][codigo]['status'] = novo_status

        # Atualizar o arquivo JSON externo com os novos dados
        with open('data/colaboradores.json', 'w') as json_file:
            json.dump(colaboradores, json_file, indent=4)

        return jsonify({'message': f'Status do colaborador {codigo} alterado para {novo_status}'}), 200
    else:
        return jsonify({'error': 'Código de colaborador não encontrado'}), 404

if __name__ == "__main__":
    app.run(debug=True)