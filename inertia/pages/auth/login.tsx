import { Form } from '@adonisjs/inertia/react'

export default function Login() {
  return (
    <div className="form-container">
      <div>
        <h1>Login</h1>
        <p>Enter your details below to login to your account</p>
      </div>

      <div>
        <Form route="session.store">
          {({ processing, errors }) => (
            <>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  data-invalid={errors.email ? 'true' : undefined}
                />
                {errors.email && <div>{errors.email}</div>}
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  data-invalid={errors.password ? 'true' : undefined}
                />
                {errors.password && <div>{errors.password}</div>}
              </div>

              <div>
                <button type="submit" className="button" disabled={processing}>
                  Login
                </button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
