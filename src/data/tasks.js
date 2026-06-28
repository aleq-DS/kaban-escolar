const tasks = [

    {
        id: 1,
        grupo: 1,

        titulo: "Pesquisa bibliográfica",
        descricao: "Pesquisar artigos científicos sobre o tema.",

        responsavel: "João",

        prioridade: "Alta",

        dataEntrega: "2026-07-10",

        status: "todo",

        aprovado: false,

        comentarioProfessor: "",

        aprovadoPor: "",

        dataAprovacao: null,

        historico: [
            {
                data: "2026-06-20",
                evento: "Tarefa criada"
            }
        ]

    },

    {
        id: 2,
        grupo: 1,

        titulo: "Protótipo",

        descricao: "Construção do primeiro protótipo.",

        responsavel: "Maria",

        prioridade: "Média",

        dataEntrega: "2026-07-20",

        status: "doing",

        aprovado: false,

        comentarioProfessor: "",

        aprovadoPor: "",

        dataAprovacao: null,

        historico: [
            {
                data: "2026-06-20",
                evento: "Tarefa criada"
            }
        ]

    },

    {
        id: 3,
        grupo: 1,

        titulo: "Corrigir Introdução",

        descricao: "Adequar introdução conforme orientação.",

        responsavel: "Pedro",

        prioridade: "Alta",

        dataEntrega: "2026-07-05",

        status: "return",

        aprovado: false,

        comentarioProfessor: "Corrigir referências ABNT.",

        aprovadoPor: "",

        dataAprovacao: null,

        historico: [
            {
                data: "2026-06-20",
                evento: "Professor devolveu para correção"
            }
        ]

    },

    {
        id: 4,
        grupo: 1,

        titulo: "Apresentação",

        descricao: "Preparar slides finais.",

        responsavel: "Ana",

        prioridade: "Baixa",

        dataEntrega: "2026-08-01",

        status: "done",

        aprovado: true,

        comentarioProfessor: "",

        aprovadoPor: "Professor Alexandre",

        dataAprovacao: "2026-06-25",

        historico: [
            {
                data: "2026-06-20",
                evento: "Entregue"
            },
            {
                data: "2026-06-25",
                evento: "Professor aprovou"
            }
        ]

    }

];

export default tasks;