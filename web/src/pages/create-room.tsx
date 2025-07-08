import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getRooms } from "@/http/get-rooms";

export function CreateRoom() {
	const { data, isLoading } = useQuery({
		queryKey: ["get-rooms"],
		queryFn: getRooms,
	});

	return (
		<div>
			{isLoading && <p>Carregando</p>}
			<div>
				{data?.map((room) => {
					return (
						<Link to={`/room/${room.id}`} key={room.id}>
							{room.name}
						</Link>
					);
				})}
			</div>
		</div>
	);
}
