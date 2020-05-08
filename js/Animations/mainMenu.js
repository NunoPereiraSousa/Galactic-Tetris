let container = document.querySelector('.animation')
let btnDiv = document.querySelectorAll('.text-center')

container.addEventListener('mousemove', e => {
    let move = e.clientX * .001

    btnDiv.forEach(btn => {
        btn.style.transform = `translateX(${move}%)`
    })
})