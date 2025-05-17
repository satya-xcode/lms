export async function fetcher(url: string) {
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.');
        throw error;
    }

    return res.json();
}