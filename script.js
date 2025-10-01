// Notas
const addBtn = document.getElementById('add')
const savedNotes = JSON.parse(localStorage.getItem('notes'))

// controle global de z-index
let highestZ = 10

if (savedNotes) {
    savedNotes.forEach(note => addNewNote(note.text, note.left, note.top))
}

addBtn.addEventListener('click', () => {
    const notesCount = document.querySelectorAll('.note').length
    let defaultText = ''

    switch (notesCount + 1) {
        //  a IEEE 802.11ah (Instituto de Engenheiros Eletricistas e Eletrônicos) é um protocolo de rede wireless publicado em 2017,
        //  chamada de Wi-fi HaLow como uma alteração do antigo padrão de rede sem fio IEEE 802;11-2007
        case 1: defaultText = 'O que é... | O Wi-fi (Wireless Fidelity) é um dos protocolos de comunicação mais populares e abundantemente utilizado quando o assunto é IoT, seja em ambientes residenciais, comerciais ou até mesmo industriais. Seu destaque vem por diversos fatores, porém com algumas limitações a serem consideradas ao projetar uma solução de IoT. '; break
        case 2: defaultText = 'Locais de Destaque | 𝗖𝗮̂𝗺𝗲𝗿𝗮𝘀 𝗲 𝗗𝗶𝗽𝗼𝘀𝗶𝘁𝗶𝘃𝗼𝘀 𝗱𝗲 𝗠𝗶́𝗱𝗶𝗮 com a transmissão de vídeo em alta definição;\n𝗘𝗹𝗲𝘁𝗿𝗼𝗱𝗼𝗺𝗲́𝘀𝘁𝗶𝗰𝗼𝘀 𝗜𝗻𝘁𝗲𝗹𝗶𝗴𝗲𝗻𝘁𝗲𝘀 como geladeiras, máquinas de lavar, TVs que exigem conectividade constante de alta largura de banda;\n𝐀𝐮𝐭𝐨𝐦𝐚𝐜̧𝐚̃𝐨 𝐑𝐞𝐬𝐢𝐝𝐞𝐧𝐜𝐢𝐚𝐥 com dispositivos que precisam de comunicação rápida e em tempo real dentro de casa;'; break
        case 3: defaultText = 'Wi-fi HaLow (802.11ah) | É um protocolo que junta todos os melhores aspectos do Wi-fi (Segurança, Facilidade de uso e Conexão IP) e resolve seus maiores problemas para o mundo dos sensores e dispositivos a bateria.'; break
        case 4: defaultText = 'Benefícios do Wi-Fi HaLow para o IOT | Longuíssimo Alcance, com o sinal viajando mais longe e conseguindo até atravessar paredes, pisos e etc; '; break
        case 5: defaultText = '\nEficiência Energética, o protocolo foi projetado com mecanismos de suspensão e ativação muito eficientes, minimizando o consumo de energia;\nConexão Nativa á Internet (IP) por se tratar de um protocolo Wi-fi todos os dispositivos se conectam diretamente o Protocolo de Internet;\nAlta Densidade, suportando conexão de milhares de dispositivos a um único ponto de acesso. '; break
        default: defaultText = 'Acabou!';
    }

    addNewNote(defaultText)
})

function addNewNote(text = '', left = '', top = '') {
    const note = document.createElement('div')
    note.classList.add('note')
    note.style.position = 'absolute'
    if (left) note.style.left = left
    if (top) note.style.top = top

    note.innerHTML = `
    <div class="tools">
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
    </div>
    <div class="main ${text ? "" : "hidden"}"></div>
    <textarea class="${text ? "hidden" : ""}"></textarea>
    `

    const editBtn = note.querySelector('.edit')
    const deleteBtn = note.querySelector('.delete')
    const main = note.querySelector('.main')
    const textArea = note.querySelector('textarea')

    textArea.value = text
    main.innerHTML = marked(text)

    deleteBtn.addEventListener('click', () => { note.remove(); updateLS() })
    editBtn.addEventListener('click', () => { 
        main.classList.toggle('hidden'); 
        textArea.classList.toggle('hidden') 
    })
    textArea.addEventListener('input', (e) => { 
        main.innerHTML = marked(e.target.value); 
        updateLS() 
    })

    // Drag melhorado
    let isDragging = false, offsetX = 0, offsetY = 0

    function onMouseMove(e) {
        if (!isDragging) return
        note.style.left = (e.pageX - offsetX) + 'px'
        note.style.top  = (e.pageY - offsetY) + 'px'
    }

    function onMouseUp() {
        if (isDragging) {
            isDragging = false
            updateLS()
        }
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
    }

    note.addEventListener('mousedown', e => {
        if (e.target.closest('.tools button')) return
        isDragging = true
        offsetX = e.offsetX
        offsetY = e.offsetY
        highestZ += 1
        note.style.zIndex = highestZ
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
    })

    document.body.appendChild(note)
    updateLS()
}

function updateLS() {
    const notesData = []
    document.querySelectorAll('.note').forEach(note => {
        notesData.push({
            text: note.querySelector('textarea').value,
            left: note.style.left || '0px',
            top: note.style.top || '0px'
        })
    })
    localStorage.setItem('notes', JSON.stringify(notesData))
}

// Modal Card
const addCardBtn = document.getElementById('addCard')
const overlay = document.getElementById('overlay')
const closeCardBtn = document.getElementById('closeCard')

addCardBtn.addEventListener('click', () => {
    overlay.classList.add('active')
    document.body.style.overflow = 'hidden' // trava fundo
})

closeCardBtn.addEventListener('click', e => {
    e.preventDefault()
    overlay.classList.remove('active')
    document.body.style.overflow = 'auto'
})
