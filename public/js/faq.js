document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true'
    const answerId = btn.getAttribute('aria-controls')
    const answer   = document.getElementById(answerId)

    // Collapse all others
    document.querySelectorAll('.faq-question').forEach(other => {
      if (other !== btn) {
        other.setAttribute('aria-expanded', 'false')
        const otherId = other.getAttribute('aria-controls')
        document.getElementById(otherId)?.classList.remove('open')
      }
    })

    btn.setAttribute('aria-expanded', String(!expanded))
    answer?.classList.toggle('open', !expanded)
  })
})
