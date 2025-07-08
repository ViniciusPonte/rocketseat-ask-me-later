type GetRoomsAPIResponse = Array<{
	id: string;
	name: string;
}>;

export async function getRooms() {
	const response = await fetch("http://localhost:3333/rooms");
	const data: GetRoomsAPIResponse = await response.json();

	return data;
}
