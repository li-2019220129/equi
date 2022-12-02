import { service } from "@/utils/request";

//上传
export function uploadLoad(data,headers) {
  return service({
    url: "/device/register/uploadSmFile",
    method: "post",
    data,
    headers
  });
}
