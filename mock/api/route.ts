import type { MockMethod } from 'vite-plugin-mock';
import { userModel, routeModel } from '../model';

const apis: MockMethod[] = [
  {
    url: '/mock/getUserRoutes',
    method: 'post',
    response: (options: Service.MockOption): Service.MockServiceResult => {
      const { userId = undefined } = options.body;

      const routeHomeName: AuthRoute.RouteKey = 'dashboard_analysis';

      const role = userModel.find(item => item.userUid === userId)?.userRole || 'super';
      const filterRoutes = routeModel[role];

      return {
        code: 200,
        message: 'ok',
        data: {
          routes: filterRoutes,
          home: routeHomeName
        },
        success: true
      };
    }
  }
];

export default apis;
