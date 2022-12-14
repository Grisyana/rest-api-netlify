import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditPhoto = () => {
	const [imageUrl, setImageUrl] = useState("");
	const [captions, setCaptions] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { id } = useParams();

	const editPhoto = async (e) => {
		e.preventDefault();
		// TODO: answer here
		try {
			const updateDate = Date.now();
			const formData = JSON.stringify({
				imageUrl,
				captions,
				updatedAt: updateDate,
			});

			await fetch(`https://gallery-app-server.vercel.app/photos/${id}`, {
				headers: {
					"Content-Type": "application/json",
				},
				method: "PATCH",
				body: formData,
			}).then((responseSend) => {
				if (responseSend.status === 403) {
					const msg = responseSend.json();
					setError(msg.error);
				} else {
					navigate(`/photos`);
				}
			});
		} catch (err) {
			setError(err.message);
		}
	};

	useEffect(() => {
		setLoading(true);
		// TODO: answer here
		const getPhotoById = async (photoid) => {
			try {
				const fetching = await fetch(`https://gallery-app-server.vercel.app/photos/${photoid}`);
				await fetching
					.json()
					.then((photo) => {
						setCaptions(photo.captions);
						setImageUrl(photo.imageUrl);
					})
					.then(() => setLoading(false));
			} catch (err) {
				setError(err.message);
			}
		};

		getPhotoById(id);
	}, [id]);

	if (error) return <div>Error!</div>;

	return (
		<>
			{loading ? (
				<h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
					Loading...
				</h1>
			) : (
				<div className="container">
					<form className="edit-form" onSubmit={editPhoto}>
						<label>
							Image Url:
							<input
								className="edit-input"
								type="text"
								value={imageUrl}
								onChange={(e) => setImageUrl(e.target.value)}
							/>
						</label>
						<label>
							Captions:
							<input
								className="edit-input"
								type="text"
								value={captions}
								data-testid="captions"
								onChange={(e) => setCaptions(e.target.value)}
							/>
						</label>
						<input
							className="submit-btn"
							type="submit"
							value="Submit"
							data-testid="submit"
						/>
					</form>
				</div>
			)}
		</>
	);
};

export default EditPhoto;
