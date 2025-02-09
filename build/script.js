let todos = []

document.addEventListener("DOMContentLoaded", () => {
  loadTodos()
  filterTodos("Today")
  document
    .querySelector("#Today")
    .addEventListener("click", () => filterTodos("Today"))
  document
    .querySelector("#Upcoming")
    .addEventListener("click", () => filterTodos("Upcoming"))

  document
    .querySelector("#Home")
    .addEventListener("click", () => filterTodos("Home"))
  document
    .querySelector("#Work")
    .addEventListener("click", () => filterTodos("Work"))
  document
    .querySelector("#Hobbies")
    .addEventListener("click", () => filterTodos("Hobbies"))

  document.querySelector("#NewTodoBtn").addEventListener("click", () => {
    document.querySelector("#NewTodo").classList.toggle("hidden")
  })
  document.querySelector("#NewTodo").addEventListener("submit", addToDo)
})

function loadTodos() {
  const storedTodos = localStorage.getItem("todos")
  if (storedTodos) {
    todos = JSON.parse(storedTodos)
  }
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos))
}

function renderTitle(category){
    const Title = document.querySelector("#CurrentView")
    Title.innerHTML = `${category}`
}

function render(filteredTodos = todos) {
  const cardContainer = document.querySelector("#cards")
  cardContainer.innerHTML = ``

  filteredTodos.sort((a, b) => {
    if (a.completed === b.completed) {
      return a.title.localeCompare(b.title)
    }
    return a.completed - b.completed
  })

  filteredTodos.forEach((todo) => {
    const card = document.createElement("div")
    card.className =
      "flex gap-2 p-5 justify-between bg-[#E3DEF3] rounded-2xl text-lg  mt-4"
    card.innerHTML = `<div class="flex gap-2">
                <input class="px-2 py-1 cursor-pointer" type="checkbox" ${
                  todo.completed ? "checked" : ""
                } data-id="${todo.id}">
                <p class="px-2 py-1 ${todo.completed ? "completed" : ""}">${
      todo.title
    }</p>
            </div>
            <div class="flex gap-2">
                <p class="px-2 py-1 w-[90px]">${todo.category}</p>
                <p class="px-2 py-1">${todo.date}</p>
                <button class="rounded-xl bg-[#9480DB] px-2 py-1 cursor-pointer" data-id="${
                  todo.id
                }">Delete</button>
            </div>
        `
    cardContainer.appendChild(card)
  })

  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", toggleTodo)
  })
  document.querySelectorAll("button[data-id]").forEach((button) => {
    button.addEventListener("click", deleteTodo)
  })
}

function toggleTodo() {
  const id = parseInt(this.getAttribute("data-id"))
  const todo = todos.find((todo) => todo.id === id)
  if (todo) {
    todo.completed = !todo.completed
    saveTodos()
    render()

  }
}

function deleteTodo() {
  const id = parseInt(this.getAttribute("data-id"))
  todos = todos.filter((todo) => todo.id !== id)
  saveTodos()
  render()

}

function filterTodos(category) {
  let filteredTodos = []
  const today = new Date().toISOString().split("T")[0]
  if (category === "Today") {
    filteredTodos = todos.filter((todo) => todo.date === today)
  } else if (category === "Upcoming") {
    filteredTodos = todos.filter(
      (todo) => new Date(todo.date) > new Date(today)
    )
  } else {
    filteredTodos = todos.filter((todo) => todo.category === category)
  }
  renderTitle(category)
  render(filteredTodos)
}

function addToDo(event) {
  event.preventDefault()

  const title = document.querySelector("#TodoNameField").value
  const date = document.querySelector("#TodoDateField").value
  const category = document.querySelector("#List").value

  if (title && date && category) {
    const newToDo = {
      id: Date.now(),
      title,
      date,
      completed: false,
      category,
    }
    todos.push(newToDo)
    saveTodos()
    render()
    updateCounts()

    document.querySelector("#TodoNameField").value = ""
    document.querySelector("#TodoDateField").value = ""
    document.querySelector("#List").value = "Home"
  } else {
    alert("Please fill in all fields.")
  }
}

