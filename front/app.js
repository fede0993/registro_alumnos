/* El front interactua con app.js mediante funciones UI en eventListeners, y en onclicks en el caso de los botones. Estas funciones realizan las validaciones,
capturan la información de los campos y actualizan el front, mediante otras funciones llamadas "Service", envian solicitudes HTTP (GET, POST Y DELETE, en este caso)
al correspondiente ENDPOINT en la API.

La API evalua la solicitud y devuelve una respuesta HTTP. Con esta respuesta app.js actualiza el html,
mostrando un mensaje de exito, error o con la información solicitada. */


const API_URL = "http://localhost:5001/api/students";
const CAREERS_API_URL = "http://localhost:5001/api/careers";
const CATEGORIES_API_URL = "http://localhost:5001/api/categories";
const API_KEY = "12345ABCDEF";

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
};

// (2) Funciones "Service"
//Envian las request a los endpoints:

// /api/students
async function registerStudentService(name, career) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ name, career })
    });
    return response.json();
}

async function getStudentByIdService(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers
    });
    return response.json();
}

async function getStudentsByCareerService(career) {
    const response = await fetch(`${API_URL}?career=${career}`, {
        method: "GET",
        headers
    });
    return response.json();
}

async function deleteStudentService(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers
    });
    return response.json();
}

// /api/careers
async function getAllCareersService() {
    const response = await fetch(CAREERS_API_URL, {
        method: "GET",
        headers
    });
    return response.json();
}

async function registerCareerService(name, duration, category) {
    const response = await fetch(CAREERS_API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ name, duration, category })
    });
    return response.json();
}

async function deleteCareerService(id) {
    const response = await fetch(`${CAREERS_API_URL}/${id}`, {
        method: "DELETE",
        headers
    });
    return response.json();
}

// /api/categories
async function registerCategoryService(name) {
    const response = await fetch(CATEGORIES_API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ name })
    });
    return response.json();
}

async function getAllCategoriesService() {
    const response = await fetch(CATEGORIES_API_URL, {
        method: "GET",
        headers
    });
    return response.json();
}

async function deleteCategoryService(id) {
    const response = await fetch(`${CATEGORIES_API_URL}/${id}`, {
        method: "DELETE",
        headers
    });
    return response.json();
}
//fin de funciones "service".




// (1) Funciones UI llamadas desde el front con onclick
async function registerStudent() {
    const name = document.getElementById('registerName').value.trim();
    const career = document.getElementById('careerSelect').value;
    const resultContainer = document.getElementById('registerResult');

    if (!name || !career) {
        Swal.fire({
            title: "",
            text: "Por favor, llene los campos.",
            icon: "error"
        });
        return;
    }

    try {
        //Llamada al Service
        const result = await registerStudentService(name, career);
        Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${result.message}`,
                showConfirmButton: false,
                timer: 1500
            });
        resultContainer.innerText = `${result.message}`;
        document.getElementById('registerName').value = '';
        document.getElementById('careerSelect').value = '';
    } catch (error) {
        console.error("Error registering student:", error);
        resultContainer.innerText = 'Error: ' + error.message;
    }
}

async function getStudentById() {
    const id = document.getElementById('studentId').value.trim();
    const resultContainer = document.getElementById('getResult');

    resultContainer.innerHTML = '';

    if (!id) {
        Swal.fire({
            title: "",
            text: "Por favor, introduce un ID de Estudiante.",
            icon: "error"
        });
        return;
    }

    try {
        //Llamada al Service
        const student = await getStudentByIdService(id);

        if (student.error) {
            resultContainer.innerHTML = `<p class="text-danger">${student.error}</p>`;
        } else {
            const studentCard = document.createElement('div');
            studentCard.classList.add('card', 'text-bg-secondary', 'mb-3');

            studentCard.innerHTML = `
                <div class="card-header">ID: ${student.id}</div>
                <div class="card-body">
                    <h5 class="card-title">${student.name}</h5>
                    <p class="card-text">Carrera: ${student.career}</p>
                    
                </div>
            `;
            resultContainer.appendChild(studentCard);
        }
    } catch (error) {
        console.error("Error al obtener estudiante:", error);
        resultContainer.innerHTML = '<p class="text-danger">Fallo al obtener estudiante.</p>';
    }
}

async function getStudentsByCareer() {
    const careerFilterSelect = document.getElementById('careerFilterSelect');
    const career = careerFilterSelect ? careerFilterSelect.value.trim() : '';
    const careerResult = document.getElementById('careerResult');

    if (!career) {
        //careerResult.innerHTML = '<p class="text-warning">Por favor, selecciona una carrera.</p>';
        Swal.fire({
            title: "",
            text: "Seleccione una carrera",
            icon: "error"
        });
        return;
    }

    try {
        //Llamada al Service
        const students = await getStudentsByCareerService(career);

        if (students && students.length > 0) {
            careerResult.innerHTML = '';
            students.forEach(student => {
                const studentCard = document.createElement('div');
                studentCard.className = 'student-card mb-2 p-2 border border-info rounded';
                studentCard.innerHTML = `
                    <div class="card-header">ID: ${student.id}</div>
                    <div class="card-body">
                        <h5 class="card-title">${student.name}</h5>
                        <p class="card-text">Carrera: ${student.career}</p>
                    </div>
                `;
                careerResult.appendChild(studentCard);
            });
        } else {
            careerResult.innerHTML = '<p class="text-info">No se encontraron estudiantes para esta carrera.</p>';
        }
    } catch (error) {
        console.error("Error fetching students by career:", error);
        careerResult.innerHTML = `<p class="text-danger">Error al consultar estudiantes por carrera: ${error.message}</p>`;
    }
}

async function deleteStudent() {
    const id = document.getElementById('deleteId').value.trim();
    const resultContainer = document.getElementById('deleteResult');

    if (!id) {
        Swal.fire({
            title: "Error",
            text: "Por favor, introduce el ID del Estudiante a exterminar.",
            icon: "error"
        });
        return;
    }

    Swal.fire({
        title: "¿Estás seguro?",
        text: `¡No podrás revertir la eliminación del estudiante con ID ${id}!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, ¡exterminar!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                //Llamada al Service
                const result = await deleteStudentService(id);

                if (result.message) {
                    Swal.fire({
                        title: "¡Exterminado!",
                        text: result.message,
                        icon: "success"
                    });
                    resultContainer.textContent = `${result.message}`;
                    document.getElementById("deleteId").value = "";
                } else if (result.error) {
                    Swal.fire({
                        title: "Error",
                        text: result.error,
                        icon: "error"
                    });
                    resultContainer.textContent = `Error: ${result.error}`;
                }
            } catch (error) {
                console.error("Error deleting student:", error);
                Swal.fire({
                    title: "Error",
                    text: "Fallo al eliminar el estudiante.",
                    icon: "error"
                });
                resultContainer.textContent = "Fallo al eliminar el estudiante.";
            }
        } else {
            Swal.fire(
                "Cancelado",
                "La eliminación del estudiante ha sido cancelada :)",
                "info"
            );
        }
    });
}


async function registerCareer() {
    const name = document.getElementById('careerName').value.trim();
    const duration = document.getElementById('careerDuration').value.trim();
    const category = document.getElementById('careerCategorySelect').value;
    const resultContainer = document.getElementById('registerCareerResult');

    if (!name || !duration || !category) {
        Swal.fire({
            title: "",
            text: "Por favor, llene los campos.",
            icon: "error"
        });
        return;
    }

    try {
        //Llamada al Service
        const data = await registerCareerService(name, duration, category);

        if (data != null) {
            resultContainer.innerText = `${data.message}`;
            document.getElementById('careerName').value = '';
            document.getElementById('careerDuration').value = '';
            document.getElementById('careerCategorySelect').value = '';
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${data.message}`,
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            resultContainer.innerText = `Error: ${data.error || 'Fallo en la API'}`;
        }
    } catch (error) {
        console.error("Error registering career:", error);
        resultContainer.innerText = 'Error: ' + error.message;
    }
}

async function deleteCareer(id) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: `¡No podrás revertir la eliminación de la carrera con ID ${id}!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, ¡eliminar!"
    }).then(async (result) => {
        if (result.isConfirmed) { 
            try {
                //Llamada al Service
                const result = await deleteCareerService(id);

                if (result.message) { 
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: result.message,
                        icon: "success"
                    });
                    loadRegisteredCareers();
                    loadCareersIntoStudentFilter();
                } else if (result.error) { 
                    Swal.fire({
                        title: "Error",
                        text: result.error,
                        icon: "error"
                    });
                }
            } catch (error) { 
                console.error("Error deleting career:", error);
                Swal.fire({
                    title: "Error",
                    text: "Fallo al eliminar la carrera.",
                    icon: "error"
                });
            }
        } else {
            Swal.fire(
                "Cancelado",
                "La eliminación de la carrera ha sido cancelada :)",
                "info"
            );
        }
    });
}

async function deleteCareerByIdFromForm() {
    const id = document.getElementById('deleteCareerId').value.trim();
    const resultContainer = document.getElementById('deleteCareerResult');

    resultContainer.innerHTML = '';

    if (!id) {
        Swal.fire({
            title: "Error",
            text: "Por favor, introduce el ID de la carrera a eliminar.",
            icon: "error"
        });
        return;
    }

    const careerId = parseInt(id, 10);

    if (isNaN(careerId)) {
        Swal.fire({
            title: "Error",
            text: "El ID debe ser un número válido.",
            icon: "error"
        });
        return;
    }

    Swal.fire({
        title: "¿Estás seguro?",
        text: `¡No podrás revertir la eliminación de la carrera con ID ${careerId}!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, ¡eliminar!"
    }).then(async (result) => { 
        if (result.isConfirmed) {
            try {
                //Llamada al Service
                const result = await deleteCareerService(careerId);

                if (result.message) {
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: result.message,
                        icon: "success"
                    });
                    resultContainer.innerText = result.message;
                    document.getElementById('deleteCareerId').value = '';
                    loadRegisteredCareers();
                    loadCareersIntoStudentFilter();
                } else if (result.error) {
                    Swal.fire({
                        title: "Error",
                        text: result.error,
                        icon: "error"
                    });
                    resultContainer.innerText = `Error: ${result.error}`;
                }
            } catch (error) {
                console.error("Error deleting career by ID from form:", error);
                Swal.fire({
                    title: "Error",
                    text: "Fallo al eliminar la carrera.",
                    icon: "error"
                });
                resultContainer.innerText = "Fallo al eliminar la carrera.";
            }
        } else {
            Swal.fire(
                "Cancelado",
                "La eliminación de la carrera ha sido cancelada :)",
                "error" 
            );
        }
    });
}

function registerCategory() {
    const name = document.getElementById('categoryName').value.trim();
    const resultContainer = document.getElementById('registerCategoryResult');

    if (!name) {
        Swal.fire({
            title: "",
            text: "Por favor, introduce el nombre de la categoría.",
            icon: "error"
        });
        return;
    }

    try {
        //Llamada al Service
        registerCategoryService(name)
            .then(data => {
                resultContainer.innerText = `${data.message}`;
                Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${data.message}`,
                showConfirmButton: false,
                timer: 2500
            });
                document.getElementById('categoryName').value = '';
            })
            .catch(error => {
                console.error("Error registering category:", error);
                resultContainer.innerText = 'Error: ' + error.message;
            });
    } catch (error) {
        console.error("Unexpected error:", error);
        resultContainer.innerText = 'Error: ' + error.message;
    }
}

async function deleteCategory(id) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: `¡No podrás revertir la eliminación de la categoría con ID ${id}!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, ¡eliminar!"
    }).then(async (result) => { 
        if (result.isConfirmed) { 
            try {
                const result = await deleteCategoryService(id); 

                if (result.message) { 
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: result.message,
                        icon: "success"
                    });
                    loadRegisteredCategories(); 
                    loadCategoriesIntoCareerForm();
                } else if (result.error) { 
                    Swal.fire({
                        title: "Error",
                        text: result.error,
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error("Error deleting category:", error);
                Swal.fire({
                    title: "Error",
                    text: "Fallo al eliminar la categoría.",
                    icon: "error"
                });
            }
        } else {
            Swal.fire(
                "Cancelado",
                "La eliminación de la categoría ha sido cancelada :)",
                "info"
            );
        }
    });
}

async function deleteCategoryByIdFromForm() {
    const id = document.getElementById('deleteCategoryId').value.trim();
    const resultContainer = document.getElementById('deleteCategoryResult');

    resultContainer.innerHTML = '';

    if (!id) {
        Swal.fire({
            title: "Error",
            text: "Por favor, introduce el ID de la categoría a eliminar.",
            icon: "error"
        });
        return;
    }

    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
        Swal.fire({
            title: "Error",
            text: "El ID debe ser un número válido.",
            icon: "error"
        });
        return;
    }

    Swal.fire({
        title: "¿Estás seguro?",
        text: `¡No podrás revertir la eliminación de la categoría con ID ${categoryId}!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, ¡eliminar!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                //Llamada al Service
                const result = await deleteCategoryService(categoryId);

                if (result.message) {
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: result.message,
                        icon: "success"
                    });
                    resultContainer.innerText = result.message;
                    document.getElementById('deleteCategoryId').value = '';
                    loadRegisteredCategories(); 
                    loadCategoriesIntoCareerForm();
                } else if (result.error) {
                    Swal.fire({
                        title: "Error",
                        text: result.error,
                        icon: "error"
                    });
                    resultContainer.innerText = `Error: ${result.error}`;
                }
            } catch (error) {
                console.error("Error deleting category by ID from form:", error);
                Swal.fire({
                    title: "Error",
                    text: "Fallo al eliminar la categoría.",
                    icon: "error"
                });
                resultContainer.innerText = "Fallo al eliminar la categoría.";
            }
        } else {
            Swal.fire(
                "Cancelado",
                "La eliminación de la categoría ha sido cancelada :)",
                "error"
            );
        }
    });
}

// Funciones UI encargadas de los desplegables
async function loadCareers() {
    const select = document.getElementById('careerSelect');
    if (!select) return;

    select.innerHTML = '<option value="">Seleccione una Carrera</option>';

    try {
        //Llamada al Service
        const careers = await getAllCareersService();
        if (Array.isArray(careers) && careers.length > 0) {
            careers.forEach(career => {
                const option = document.createElement('option');
                option.value = career.name;
                option.textContent = career.name;
                select.appendChild(option);
            });
        } else {
            select.innerHTML += '<option value="" disabled>No hay carreras disponibles</option>';
        }
    } catch (error) {
        console.error('Error loading careers for registration:', error);
        select.innerHTML = '<option value="">Error al cargar carreras</option>';
    }
}

async function loadCareersIntoStudentFilter() {
    const careerFilterSelect = document.getElementById('careerFilterSelect');
    if (!careerFilterSelect) {
        console.warn("Elemento 'careerFilterSelect' no encontrado en el DOM.");
        return;
    }

    careerFilterSelect.innerHTML = '<option value="">Cargando Carreras...</option>';

    try {
        //Llamada al Service
        const careers = await getAllCareersService();
        careerFilterSelect.innerHTML = '<option value="">Selecciona una carrera</option>';

        if (Array.isArray(careers) && careers.length > 0) {
            careers.forEach(career => {
                const option = document.createElement('option');
                option.value = career.name;
                option.textContent = career.name;
                careerFilterSelect.appendChild(option);
            });
        } else {
            console.warn('No se encontraron carreras o la respuesta de la API no es un array válido:', careers);
            careerFilterSelect.innerHTML = '<option value="">No hay carreras disponibles</option>';
        }
    } catch (error) {
        console.error('Error al cargar carreras para el filtro de estudiantes:', error);
        careerFilterSelect.innerHTML = '<option value="">Error al cargar carreras</option>';
    }
}

async function loadCategoriesIntoCareerForm() {
    const categorySelect = document.getElementById('careerCategorySelect');
    if (!categorySelect) return;

    categorySelect.innerHTML = '<option value="">Cargando Categorías...</option>';

    try {
        //Llamada al Service
        const categories = await getAllCategoriesService();
        categorySelect.innerHTML = '<option value="">Seleccione una Categoría</option>';

        if (Array.isArray(categories) && categories.length > 0) {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } else {
            categorySelect.innerHTML += '<option value="" disabled>No hay categorías registradas</option>';
        }
    } catch (error) {
        console.error("Error loading categories into career form:", error);
        categorySelect.innerHTML = '<option value="">Error al cargar categorías</option>';
    }
}

async function loadRegisteredCareers() {
    const careersList = document.getElementById('registeredCareersList');
    if (!careersList) return;

    careersList.innerHTML = '<p class="text-center text-muted">Cargando carreras...</p>';

    try {
        //Llamada al Service
        const data = await getAllCareersService();

        careersList.innerHTML = '';

        if (data.length === 0) {
            careersList.innerHTML = '<p class="text-info">No hay carreras registradas.</p>';
            return;
        }

        data.forEach(career => {
            const careerCard = document.createElement('div');
            careerCard.classList.add('card', 'text-bg-secondary', 'mb-3');

            careerCard.innerHTML = `
                <div class="card-header">ID: ${career.id}</div>
                <div class="card-body">
                    <h5 class="card-title">${career.name}</h5>
                    <p class="card-text">Duración: ${career.duration ? career.duration + ' años' : 'No especificado'}</p>
                    <p class="card-text">Categoría: ${career.category ? career.category : 'No especificada'}</p>
                    <button class="btn btn-sm btn-danger float-end" onclick="deleteCareer(${career.id})">Eliminar</button>
                </div>
            `;
            careersList.appendChild(careerCard);
        });

    } catch (error) {
        console.error('Error loading registered careers:', error);
        careersList.innerHTML = '<p class="text-danger">Error al cargar las carreras.</p>';
    }
}

async function loadRegisteredCategories() {
    const categoriesList = document.getElementById('registeredCategoriesList');
    if (!categoriesList) return;

    categoriesList.innerHTML = '';

    try {
        //Llamada al Service
        const data = await getAllCategoriesService();

        if (data.length === 0) {
            categoriesList.innerHTML = '<p class="text-info">No hay categorías registradas.</p>';
            return;
        }

        data.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.classList.add('card', 'text-bg-secondary', 'mb-3');

            categoryCard.innerHTML = `
                <div class="card-header">ID: ${category.id}</div>
                <div class="card-body">
                    <h5 class="card-title">${category.name}</h5>
                    <button class="btn btn-sm btn-danger float-end" onclick="deleteCategory(${category.id})">Eliminar</button>
                </div>
            `;
            categoriesList.appendChild(categoryCard);
        });

    } catch (error) {
        console.error('Error loading registered categories:', error);
        categoriesList.innerHTML = '<p class="text-danger">Error al cargar las categorías.</p>';
    }
}

/*EventListener, pendiente unicamente de las funciones que populan los desplegables
cuando la página se cargó completamente*/
document.addEventListener('DOMContentLoaded', () => {
    loadCareers();
    loadCareersIntoStudentFilter();
    loadCategoriesIntoCareerForm();
    //loadRegisteredCareers();
    //loadRegisteredCategories();
});



window.registerStudent = registerStudent;
window.getStudentById = getStudentById;
window.getStudentsByCareer = getStudentsByCareer;
window.deleteStudent = deleteStudent;
window.registerCareer = registerCareer;
window.deleteCareer = deleteCareer;
window.registerCategory = registerCategory;
window.deleteCategory = deleteCategory;