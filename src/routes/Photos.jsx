import { useEffect } from "react";
import { useState } from "react";
import Card from "../components/Card";

const Photos = () => {
	const [photos, setPhotos] = useState([]);
	const [sort, setSort] = useState("asc");
	const [submited, setSubmited] = useState("");
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const deletePhoto = async (id) => {
		// TODO: answer here
		try {
			const responseSend = await fetch(`https://gallery-app-server.vercel.app/photos/${id}`, {
				method: "DELETE",
			});

			if (responseSend.status === 404) {
				const msg = await responseSend.json();
				setError(msg.error);
			} else {
				setPhotos((photos) => photos.filter((photo) => photo.id !== id));
			}
		} catch (err) {
			setError(err.message);
		}
	};

	useEffect(() => {
		setLoading(true);
		// TODO: answer here
		const customPhotosList = async (sorter, searcher) => {
			try {
				const urlFetch =
					!searcher && sorter === "asc"
						? "https://gallery-app-server.vercel.app/photos"
						: !searcher && sorter === "desc"
						? `https://gallery-app-server.vercel.app/photos?_sort=id&_order=${sorter}`
						: `https://gallery-app-server.vercel.app/photos?_sort=id&_order=${sorter}&q=${searcher}`;
				const fetching = await fetch(urlFetch);

				const photosData = await fetching.json();
				setPhotos(photosData);
				setLoading(false);
			} catch (err) {
				setError(true);
			}
		};

		// eslint-disable-next-line no-mixed-operators
		if(!submited && sort === 'desc' || submited && sort === 'asc') {
			customPhotosList(sort, submited);
		}
	}, [sort, submited]);

	useEffect(() => {
		setLoading(true);
		// TODO: answer here
		const getPhotos = async () => {
			try {
				const fetching = await fetch("https://gallery-app-server.vercel.app/photos");
				await fetching
					.json()
					.then((photosData) => setPhotos(photosData))
					.then(() => setLoading(false));
			} catch (err) {
				setError(true);
			}
		};

		if (!submited && sort === 'asc') {
			getPhotos();
		}
	}, [sort, submited]);

	if (error)
		return (
			<h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
				Error!
			</h1>
		);

	return (
		<>
			<div className="container">
				<div className="options">
					<select
						onChange={(e) => setSort(e.target.value)}
						data-testid="sort"
						className="form-select"
						style={{}}
					>
						<option value="asc">Ascending</option>
						<option value="desc">Descending</option>
					</select>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							setSubmited(search);
						}}
					>
						<input
							type="text"
							data-testid="search"
							onChange={(e) => setSearch(e.target.value)}
							className="form-input"
						/>
						<input
							type="submit"
							value="Search"
							data-testid="submit"
							className="form-btn"
						/>
					</form>
				</div>
				<div className="content">
					{loading ? (
						<h1
							style={{ width: "100%", textAlign: "center", marginTop: "20px" }}
						>
							Loading...
						</h1>
					) : (
						photos.map((photo) => {
							return (
								<Card key={photo.id} photo={photo} deletePhoto={deletePhoto} />
							);
						})
					)}
				</div>
			</div>
		</>
	);
};

export default Photos;
