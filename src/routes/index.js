// import otpRouter from './otp'
import versionHealth from './version_health'
import { httpStatus } from '../constants'
import { AppError } from '../utils'

const RouteData = [
  { path: '/', router: versionHealth }
  /* { path: '/otp', router: otpRouter }, */
]

export const Routes = (app) => {
  // Setting application routes
  RouteData.forEach((route) => app.use(route.path, route.router))

  // If not found 404 route
  app.use(function (req, res, next) {
    throw new AppError('No route found', httpStatus.NOT_FOUND)
  })
}
