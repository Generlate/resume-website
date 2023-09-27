let slideIndex: number = 1
showSlides(slideIndex)

function plusSlides(n: number): void {
  showSlides(slideIndex += n)
}

function currentSlide(n: number) {
  showSlides(slideIndex = n);
}

function showSlides(n: number): void {
  let i
  const slides: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName('slides') as HTMLCollectionOf<HTMLElement>
  const dots: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName('dot') as HTMLCollectionOf<HTMLElement>

  if (n > slides.length) {
    slideIndex = 1
  }

  if (n < 1) {
    slideIndex = slides.length
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none'
  }

  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(' active', '')
  }

  slides[slideIndex - 1].style.display = 'block'
  dots[slideIndex - 1].className += ' active'
}
