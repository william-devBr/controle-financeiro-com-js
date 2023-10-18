/** SCRIPT INDEX JS */
const divTransacoes = document.getElementById("transacoes");
const amountReceita = document.querySelector(".receitas");
const amountDespesas = document.querySelector(".despesas");
const amountTotal = document.getElementById("total-balance");
const inputName = document.getElementById("nome");
const inputValor = document.getElementById("valor");
const textMes = document.querySelector(".mes");

const form = document.getElementById("form")

const mesesDoAno = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

const dataAtual = new Date();

textMes.textContent = mesesDoAno[dataAtual.getMonth()];

let transactions = localStorage.getItem('transacoes') ? JSON.parse(localStorage.getItem('transacoes')) : []

const saveTransaction = transact => {
    localStorage.setItem('transacoes',JSON.stringify(transact))
}

const removeTransaction = ID => {
      
    transactions = transactions.filter(item => item.id !== ID);
    saveTransaction(transactions);
     init();
}


const addTransaction = transaction => {
   
    const operador = transaction.amount < 0 ? '-' : '+';
    const cssOperadror = transaction.amount < 0 ? 'saida' : 'entrada';
    const amountABS = Math.abs(transaction.amount)
    divTransacoes.innerHTML += `
               <div class="block">
               <span class="remove-transaction" onClick="removeTransaction(${transaction.id})">x</span>
                <span class="transacao-nome">${transaction.name}</span>
                <div class="valor ${cssOperadror}">${operador} <span style="margin-right:10px">R$${amountABS}</span></div>
            </div> `
}

const updateBalances = ()=> {

    const amounts =  transactions.map( item => item.amount)
    let despesas = amounts.filter( transc => transc < 0).reduce((acc,value) => acc + value,0).toFixed(2);
    let receitas =  amounts.filter( transc => transc > 0).reduce((acc,value) => acc + value,0).toFixed(2);
    let total = amounts.reduce((acc,number)=> acc+number,0).toFixed(2)
    
    amountDespesas.textContent = despesas;
    amountReceita.textContent = receitas
    amountTotal.textContent = "R$ "+total;
}

const init = ()=> {

    divTransacoes.innerHTML = ''
    transactions.forEach(addTransaction)
    updateBalances();
}

init()

const submitHandle = event => {
     event.preventDefault();
    
     let input_name = inputName.value.trim()
     let input_valor = inputValor.value.trim()

     if(input_name === '' || input_valor === ''){
          alert('existem campos vazios');
          return;
     }

     let newTransaction = {
        id : Math.floor(Math.random() * 1000),
        name : input_name,
        amount : Number(input_valor)
     }
     inputName.value = '';
     inputValor.value = '';

     transactions.push(newTransaction);
     saveTransaction(transactions)
     init();
}

form.addEventListener('submit',submitHandle);

inputName.addEventListener('input',()=>{
    //permite apenas letras , espaços e letras com caracteres
    return inputName.value = inputName.value.replace(/[^a-zA-Z\u00C0-\u017F\s]/g, '')
})

inputValor.addEventListener('input',()=>{
    //permite apenas numeros e ponto e vírgula
    return inputValor.value = inputValor.value.replace(/[^\d.,-]/g,'').replace(",",".")
})