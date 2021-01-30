{   const formatter = new Intl.NumberFormat('fil-PH', {
        style: 'currency',
        currency: 'PHP'
    });

    function Income(description, amount) {
        this.description = description
        this.amount = parseInt(amount)
        this.id = Math.random().toString().substr(2, 10);
        this.render = function () {
            return `<div class="item clearfix" id="parent_${this.id}">
            <div class="item__description">${this.description}</div>
            <div class="right clearfix">
                <div class="item__value">+ ${formatter.format(this.amount)}</div>
                <div class="item__delete">
                    <button class="item__delete--btn" id="btn_${this.id}">
                <i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
            </div>`
        }
    };

    function Expense(description, amount) {
        this.description = description
        this.amount = parseInt(amount)
        this.id = Math.random().toString().substr(2, 10);
        this.percentage = 0
        this.calcPercentage = function (incomeTotal) {
            if(incomeTotal <= 0) {
                this.percentage = 100
            }
            else {
                this.percentage = (this.amount/incomeTotal) *100
            }
        }
        this.render = function () {
            return `<div class="item clearfix" id="parent_${this.id}">
            <div class="item__description">${this.description}</div>
            <div class="right clearfix">
                <div class="item__value">- ${formatter.format(this.amount)}</div>
                <div class="item__percentage" id="percentage_${this.id}">${Math.round(this.percentage)}%</div>
                <div class="item__delete">
                    <button class="item__delete--btn" id="btn_${this.id}"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
            </div>`
            
        }
    };

    let description = document.querySelector('.add__description')
    let amount = document.querySelector('.add__value')
    let addBtn = document.querySelector('.add__btn')
    let inputType = document.querySelector('.add__type')
    let incomeDisplay = document.querySelector('.budget__income--value')
    let expenseDisplay = document.querySelector('.budget__expenses--value')
    let budgetDisplay = document.querySelector('.budget__value')
    let percentageDisplay = document.querySelector('.budget__expenses--percentage')
    let incomeArr = []
    let expenseArr = []
    let getIncomeTotal = () => {
        return incomeArr.reduce((total, income) => {
            return total + income.amount
        }, 0)
    }
    
    let addIncome = () => {
        let newDiv = document.createElement('div')
        let income = new Income(description.value, amount.value)
        incomeArr.push(income)
        let incomeTotal = getIncomeTotal();
        percentageDisplay.innerHTML = `${Math.round(calcPercentageTotal())}%`
        incomeDisplay.innerHTML = formatter.format(incomeTotal)
        document.querySelector('.income__list').appendChild(newDiv)
        newDiv.innerHTML = income.render();
        expenseArr.forEach(expense => expense.calcPercentage(incomeTotal))
        expenseArr.forEach(expense => {
            document.querySelector(`#percentage_${expense.id}`).textContent = `${Math.round(expense.percentage)}%`
        })
        var deleteBtn = document.querySelector(`#btn_${income.id}`)
        deleteBtn.onclick = () => {
            incomeArr.forEach(inc => {
                if(inc.id == income.id) {               
                document.querySelector(`#parent_${income.id}`).remove()
            }
        })
            incomeArr = incomeArr.filter((inc) => {
                return inc.id !== income.id
            })
            let incomeTotal = incomeArr.reduce((total, income) => {
                return total + income.amount
            }, 0)  
            incomeDisplay.innerHTML = formatter.format(incomeTotal)
            budgetDisplay.innerHTML = budgetcalc();
        }
    }

    let addExpense = () => {
        let newDiv = document.createElement('div')
        let incomeTotal = getIncomeTotal();
        let expense = new Expense(description.value, amount.value)
        expense.calcPercentage(incomeTotal);
        expenseArr.push(expense)
        let expenseTotal = expenseArr.reduce((total, expense) => {
            return total + expense.amount
        }, 0)
        percentageDisplay.innerHTML = `${Math.round(calcPercentageTotal())}%`
        expenseDisplay.innerHTML = formatter.format(expenseTotal)
        document.querySelector('.expenses__list').appendChild(newDiv)
        newDiv.innerHTML = expense.render();
        var deleteBtn = document.querySelector(`#btn_${expense.id}`)
        deleteBtn.onclick = () => {
            expenseArr.forEach(exp => {
                if(exp.id == expense.id) {               
                document.querySelector(`#parent_${expense.id}`).remove()
            }
        })
            expenseArr = expenseArr.filter((exp) => {
                return exp.id !== expense.id
            })
            let expenseTotal = expenseArr.reduce((total, expense) => {
                return total + expense.amount
            }, 0)  
            expenseDisplay.innerHTML = formatter.format(expenseTotal)
            budgetDisplay.innerHTML = budgetcalc();
        }
    }

    let budgetcalc = () => {
        let incomeTotal = getIncomeTotal();
        let expenseTotal = expenseArr.reduce((total, expense) => {
            return total + expense.amount
        }, 0)
        return formatter.format(incomeTotal - expenseTotal)
    }

    let calcPercentageTotal = () => {
        let incomeTotal = getIncomeTotal();
        let expenseTotal = expenseArr.reduce((total, expense) => {
            return total + expense.amount
        }, 0)
        if(incomeTotal <= 0) {
            return 100
        }
        else {
        return (expenseTotal/incomeTotal) * 100
        }
    }

    addBtn.addEventListener('click', () => {
        if(inputType.value == 'inc') {
            addIncome();
            budgetDisplay.innerHTML = budgetcalc();
        }
        else {
            addExpense();
            budgetDisplay.innerHTML = budgetcalc();
        }
    })
}