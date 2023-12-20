fetch('/ler_json_colaboradores')
    .then(response => response.json())
    .then(data => {
        const colaboradores = data['colaboradores'];

        const tabelaColaboradores = document.getElementById('tabela-colaboradores').getElementsByTagName('tbody')[0];
        const tabelaColaboradoresEndividados = document.getElementById('tabela-colaboradores-endividados').getElementsByTagName('tbody')[0];
        
        let colaboradoresLimpos = 0;
        let colaboradoresEndividados = 0;

        for (const chave in colaboradores) {
            if (colaboradores.hasOwnProperty(chave)) {
                const colaborador = colaboradores[chave];
                const nome = colaborador.nome;
                const status = colaborador.status;
                
                const linha = document.createElement('tr');
                const colunaId = document.createElement('td');
                const colunaNome = document.createElement('td');
                
                colunaId.textContent = chave;
                colunaNome.textContent = nome;

                if (status === 'Limpo') {
                    linha.appendChild(colunaId);
                    linha.appendChild(colunaNome);
                    tabelaColaboradores.appendChild(linha);
                    colaboradoresLimpos++;
                } else if (status === 'Endividado') {
                    linha.appendChild(colunaId);
                    linha.appendChild(colunaNome);
                    tabelaColaboradoresEndividados.appendChild(linha);
                    colaboradoresEndividados++;
                }
            }
        }

        // Atualizar contadores
        document.getElementById('contagem-colaboradores-limpos').value = colaboradoresLimpos;
        document.getElementById('contagem-colaboradores-endividados').value = colaboradoresEndividados;
    })
    .catch(error => {
        console.error('Erro ao carregar os dados:', error);
    });

    document.getElementById('btnEmprestar').addEventListener('click', function() {
        const codigoColaborador = document.getElementById('inpCodColab').value;
    
        fetch('/ler_json_colaboradores')
            .then(response => response.json())
            .then(data => {
                const colaboradores = data['colaboradores'];
    
                if (colaboradores.hasOwnProperty(codigoColaborador)) {
                    colaboradores[codigoColaborador].status = 'Endividado';
    
                    // Armazenar a atualização localmente
                    localStorage.setItem('colaboradores', JSON.stringify(data));
    
                    // Enviar a atualização para o servidor e recarregar a página após a confirmação
                    fetch('/atualizar_colaborador', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            codigo: codigoColaborador,
                            novoStatus: 'Endividado'
                        })
                    })
                    .then(response => response.json())
                    .then(updatedData => {
                        // Exibindo os dados atualizados no console (opcional)
                        console.log(updatedData);
    
                        alert(`Status do colaborador com código ${codigoColaborador} alterado para "Endividado".`);
    
                        // Recarregar a página após a atualização
                        location.reload();
                    })
                    .catch(error => {
                        console.error('Erro ao enviar a atualização para o servidor:', error);
                        alert('Erro ao atualizar o status do colaborador no servidor.');
                    });
                } else {
                    alert('Código de colaborador não encontrado no JSON.');
                }
            })
            .catch(error => {
                console.error('Erro ao carregar os dados:', error);
                alert('Erro ao carregar os dados dos colaboradores.');
            });
    });
    
    document.getElementById('btnDevolver').addEventListener('click', function() {
        const codigoColaborador = document.getElementById('inputCodColab2').value;
    
        fetch('/ler_json_colaboradores')
            .then(response => response.json())
            .then(data => {
                const colaboradores = data['colaboradores'];
    
                if (colaboradores.hasOwnProperty(codigoColaborador)) {
                    if (colaboradores[codigoColaborador].status === 'Endividado') {
                        colaboradores[codigoColaborador].status = 'Limpo';
    
                        // Enviar a atualização para o servidor
                        fetch('/atualizar_colaborador', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                codigo: codigoColaborador,
                                novoStatus: 'Limpo'
                            })
                        })
                        .then(response => response.json())
                        .then(updatedData => {
                            console.log(updatedData); // Visualizar os dados atualizados (opcional)
    
                            alert(`Status do colaborador com código ${codigoColaborador} alterado para "Limpo".`);
    
                            // Recarregar a página após a atualização
                            location.reload();
                        })
                        .catch(error => {
                            console.error('Erro ao enviar a atualização para o servidor:', error);
                            alert('Erro ao atualizar o status do colaborador no servidor.');
                        });
                    } else {
                        alert('O colaborador não está endividado.');
                    }
                } else {
                    alert('Código de colaborador não encontrado no JSON.');
                }
            })
            .catch(error => {
                console.error('Erro ao carregar os dados:', error);
                alert('Erro ao carregar os dados dos colaboradores.');
            });
    });