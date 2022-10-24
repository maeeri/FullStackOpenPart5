beforeEach(() => {
  //reset clears database, creates user 'taotao' and adds some blog posts by the user in the backend
  window.localStorage.removeItem('loggedBlogappUser')
  cy.request('POST', 'http://localhost:3003/api/testing/reset')
  cy.request('POST', 'http://localhost:3003/api/users', { username: 'maijameh', name: 'Maija Mehiläinen', password: 'password' })
  cy.visit('http://localhost:3000')
})

describe('Blog app', function() {


  it.skip('login form is shown', () => {
    cy.contains('Log in')
  })

  describe('login', () => {
    it('succeeds with proper credentials', () => {
      cy.get('#username').type('maijameh')
      cy.get('#password').type('password')
      cy.get('#login-btn').click()
    })

    it('fails with wrong credentials', () => {
      cy.get('#logout').click()
      cy.get('#username').type('faijameh')
      cy.get('#password').type('password')
      cy.get('#login-btn').click()

      cy.contains('wrong username or password')
    })
  })

  describe('when logged in', () => {
    beforeEach(() => {
      cy.login({ username: 'maijameh', password: 'password' })
    })

    it('a blog can be created', () => {
      cy.contains('add a blog').click()
      cy.get('#authorInput').type('someone great')
      cy.get('#titleInput').type('a wonderful post on kittens')
      cy.get('#urlInput').type('some url')
      cy.get('#create-blog').click()
      cy.contains('a wonderful post on kittens')
    })

    it('a blog can be deleted', () => {
      cy.login({ username: 'taotao', password: 'password' })
      cy.contains('show').click()
      cy.contains('delete').click()
      //blog post with most likes up top, in this case, titled Canonical string reduction
      cy.contains('Canonical string reduction deleted')
      cy.contains('log out').click()
    })

    it('a blog can\'t be deleted by other user', () => {
      cy.contains('show').click()
      cy.get('delete').should('not.exist')
    })

    it('a blog can be liked', async () => {
      cy.contains('show').click()
      await cy.contains('like').click()
    })

    it('blogs are ordered by likes', () => {
      cy.get('.blog').eq(0).should('contain', 'Canonical string reduction')
      cy.get('.blog').eq(1).should('contain', 'First class tests')
      cy.get('.blog').eq(2).should('contain', 'React patterns')
      cy.get('.blog').eq(3).should('contain', 'Go To Statement Considered Harmful')
      cy.get('.blog').eq(4).should('contain', 'Type wars')
      cy.get('.blog').eq(5).should('contain', 'TDD harms architecture')
    })
  })
})