import { HttpInterceptorFn } from '@angular/common/http';

export const attachRequestCredentialsInterceptor: HttpInterceptorFn = (
  req,
  next,
) => {
  const clone = req.clone({
    credentials: 'include',
  });

  return next(clone);
};
