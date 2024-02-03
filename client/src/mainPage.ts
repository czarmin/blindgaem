function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    
    document.querySelector('#goToNew')?.setAttribute("href", "/gm?gameid="+result)
}

makeid(5)

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('epicform') as HTMLFormElement;
    form.onsubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const gameID = formData.get('gameid') as string;
        window.location.href = "/play?gameid="+gameID.toUpperCase()
    };
});
