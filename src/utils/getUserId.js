export function getUserId(req) {
  return req.user.role === "admin" ? req.user.admin_id : req.user.doctor_id;
}