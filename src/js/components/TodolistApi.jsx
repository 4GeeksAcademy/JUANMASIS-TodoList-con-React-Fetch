import React, { useState, useEffect } from "react";

export const TodolistApi = () => {
	const [lista, setLista] = useState([]);
	const [tarea, setTarea] = useState("");

	const API_URL = "https://playground.4geeks.com/todo";
	const USER_NAME = "juanmasis_tareas_api";

	const crearUsuario = async () => {
		try {
			const response = await fetch(API_URL + "/users/" + USER_NAME, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				}
			});

			const data = await response.json();
			console.log("Usuario creado:", data);
		} catch (error) {
			console.log("Error al crear usuario:", error);
		}
	};

	const obtenerLista = async () => {
		try {
			const response = await fetch(API_URL + "/users/" + USER_NAME);

			if (response.status === 404) {
				await crearUsuario();
				return obtenerLista();
			}

			const data = await response.json();
			console.log("Lista obtenida:", data);

			if (data.todos) {
				setLista(data.todos);
			} else {
				setLista([]);
			}
		} catch (error) {
			console.log("Error al obtener la lista:", error);
		}
	};

	const crearTarea = async (texto) => {
		if (texto.trim() === "") return;

		try {
			const response = await fetch(API_URL + "/todos/" + USER_NAME, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					label: texto,
					is_done: false
				})
			});

			const data = await response.json();
			console.log("Tarea creada:", data);

			await obtenerLista();
		} catch (error) {
			console.log("Error al crear tarea:", error);
		}
	};

	const eliminarTarea = async (id) => {
		try {
			const response = await fetch(API_URL + "/todos/" + id, {
				method: "DELETE"
			});

			const data = await response.json();
			console.log("Tarea eliminada:", data);

			await obtenerLista();
		} catch (error) {
			console.log("Error al eliminar tarea:", error);
		}
	};

	const limpiarTodas = async () => {
		try {
			for (let i = 0; i < lista.length; i++) {
				await fetch(API_URL + "/todos/" + lista[i].id, {
					method: "DELETE"
				});
			}

			await obtenerLista();
		} catch (error) {
			console.log("Error al limpiar tareas:", error);
		}
	};

	const manejarEnter = (e) => {
		if (e.key === "Enter") {
			crearTarea(tarea);
			setTarea("");
		}
	};

	useEffect(() => {
		obtenerLista();
	}, []);

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-12 col-md-8 col-lg-6">
					<h1 className="text-center main-title">TASKS AND EVENTS</h1>

					<div className="paper">
						<input
							type="text"
							className="form-control mb-3"
							placeholder="What needs to be done?"
							value={tarea}
							onChange={(e) => setTarea(e.target.value)}
							onKeyDown={manejarEnter}
						/>

						<ul className="list-group">
							{lista.length === 0 ? (
								<li className="list-group-item text-muted">No hay tareas</li>
							) : (
								lista.map((item) => (
									<li
										key={item.id}
										className="list-group-item d-flex justify-content-between align-items-center"
									>
										<span>{item.label}</span>
										<button
											className="btn btn-sm btn-danger"
											onClick={() => eliminarTarea(item.id)}
										>
											X
										</button>
									</li>
								))
							)}
						</ul>

						<div className="d-flex justify-content-between align-items-center mt-3">
							<p className="itemsleft m-0">
								{lista.length} tarea{lista.length !== 1 ? "s" : ""} pendiente{lista.length !== 1 ? "s" : ""}
							</p>

							<button className="btn btn-warning btn-sm" onClick={limpiarTodas}>
								Limpiar todas
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};