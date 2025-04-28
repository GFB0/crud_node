const db = require('./banco.js');

const Agendamento = db.sequelize.define('agendamentos', {
    nome:{
        type: db.Sequelize.STRING
    },
    telefone:{
        type: db.Sequelize.STRING
    },
    origem:{
        type: db.Sequelize.STRING
    },
    data_contato:{
        type: db.Sequelize.DATE
    },
    observacao:{
        type: db.Sequelize.TEXT
    }
});

Agendamento.sync({force: true});

module.exports = Agendamento;

// O código acima cria um modelo de postagem com os campos nome, telefone, origem, data_contato e observacao.