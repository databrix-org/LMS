export const updateUserProfile = async (userData) => {
    const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error('Failed to update profile');
    }

    return response.json();
}; 