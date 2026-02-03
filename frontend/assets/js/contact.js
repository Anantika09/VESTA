document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const contactData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('http://localhost:5000/api/contact/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message);
            document.getElementById('contactForm').reset();
        }
    } catch (err) {
        alert("Server is offline. Try again later.");
    }
});