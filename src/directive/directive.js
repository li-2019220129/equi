import Vue from "vue";
import store from "../store";
// 检测是否有权限
// 使用Vue.directive声明自定义指令btn-key
export const buttonPermissions = Vue.directive("has", {
  /**
   * inserted：被绑定元素插入父节点时调用
   * el：指令所绑定的元素，可以用来直接操作 DOM
   * binding.value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
   */

  inserted(el, binding) {
    let buttonKey = binding.value;
    // 代表某个元素需要通过权限验证
    if (buttonKey) {
      let key = checkKey(buttonKey);
      if (!key) {
        //没有权限
        el.remove(); //删除按钮
      }
    } else {
      throw new Error("缺少唯一指令");
    }
  },

  update(el, binding) {
    let buttonKey = binding.value;
    // 代表某个元素需要通过权限验证
    if (buttonKey) {
      let key = checkKey(buttonKey);
      if (!key) {
        //没有权限
        el.remove(); //删除按钮
      }
    } else {
      throw new Error("缺少唯一指令");
    }
  },
});

// 检测传入的元素key是否可以显示
function checkKey(key) {
  // 获取权限数组
  // store.dispatch("login/userAuth").then((res) => {
  let permissionData = store.state.login.userAuth.childMenu;
  //如果传入的元素key不在权限数组里，则不可显示
  let index = permissionData.indexOf(key);
  if (index > -1) {
    return true;
  } else {
    return false;
  }
  // });
}
