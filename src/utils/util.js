export default {
  install(Vue, options) {
    Vue.prototype.$Util = {
      String: {
        hello: function () {
          return "hello world";
        },
      },

      //过滤树形数组
      removeTreeDataById: function (arr, id) {
        let newArr = [];
        arr.forEach((element) => {
          if (element.id != id) {
            if (element.children != null && element.children.length > 0) {
              let arr2 = Vue.prototype.$Util.removeTreeDataById(
                element.children,
                id
              );
              element.children = arr2;
            }
            newArr.push(element);
          } else {
          }
        });
        return newArr;
      },

      addTreeDataById: function (arr, pid, obj) {
        let newArr = [];
        arr.forEach((element) => {
          if (element.id != pid) {
            if (element.children.length > 0) {
              let arr2 = Vue.prototype.$Util.addTreeDataById(
                element.children,
                pid,
                obj
              );
              element.children = arr2;
            }
          } else {
            if (element.children == null || element.children.length < 1) {
              element.children = [];
            }
            element.children.push(obj);
          }
          newArr.push(element);
        });
        return newArr;
      },

      findTreeDataById: function (arr, id) {
        let obj = null;
        arr.forEach((element) => {
          if (element.id != id) {
            if (element.children && element.children.length > 0) {
              let objx = Vue.prototype.$Util.findTreeDataById(
                element.children,
                id
              );
              if (objx != null) {
                obj = objx;
              }
            }
          } else {
            obj = element;
          }
        });
        return obj;
      },

      findTreeDataBySystemId: function (arr, id) {
        let obj = null;
        arr.forEach((element) => {
          if (element.attributes.systemId != id) {
            if (element.children && element.children.length > 0) {
              let objx = Vue.prototype.$Util.findTreeDataBySystemId(
                element.children,
                id
              );
              if (objx != null) {
                obj = objx;
              }
            }
          } else {
            obj = element;
          }
        });
        return obj;
      },

      moveTreeNode: function (arr, moveNode, parentId) {
        var flag = false;
        for (let node of arr) {
          if (node.id == parentId) {
            if (node.children == null || node.children.length < 1) {
              node.children = [];
              moveNode.attributes.sortNum = 1;
            } else {
              moveNode.attributes.sortNum =
                node.children[node.children.length - 1].attributes.sortNum + 1;
            }
            node.children.push(moveNode);
            flag = true;
            break;
          } else {
            if (node.children != null && node.children.length > 0) {
              flag = Vue.prototype.$Util.moveTreeNode(
                node.children,
                moveNode,
                parentId
              );
              if (flag == true) {
                break;
              }
            }
          }
        }
        return flag;
      },

      deduplicationArray(array) {
        //去除重复数组元素方法
        var temp = []; //一个新的临时数组
        for (var i = 0; i < array.length; i++) {
          if (temp.indexOf(array[i]) == -1) {
            temp.push(array[i]);
          }
        }
        return temp;
      },

      timestamp(times) {
        var date = new Date(times); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + "-";
        var M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        var D =
          (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
        var h =
          (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
          ":";
        var m =
          (date.getMinutes() < 10
            ? "0" + date.getMinutes()
            : date.getMinutes()) + ":";
        var s =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
      },

      findTreeAllParentById: function (arr, id) {
        var allParent = [];
        var flag = true;
        while (flag) {
          let parent = Vue.prototype.$Util.findTreeParentById(arr, id, null);
          if (parent) {
            allParent.push(parent);
            id = parent.id;
          } else {
            flag = false;
          }
        }
        return allParent;
      },

      findTreeParentById: function (arr, id) {
        var result = Vue.prototype.$Util.findTreeParent(arr, id, null);
        return result.parent;
      },

      findTreeParent: function (arr, id, parent) {
        var result = {
          flag: false,
          parent: null,
        };
        for (let node of arr) {
          if (node.id == id) {
            result = {
              flag: true,
              parent: parent,
            };
            break;
          } else {
            if (node.children != null && node.children.length > 0) {
              result = Vue.prototype.$Util.findTreeParent(
                node.children,
                id,
                node
              );
              if (result.flag) {
                break;
              }
            }
          }
        }
        return result;
      },

      findFistParentById: function (arr, id) {
        var result = Vue.prototype.$Util.findFistParent(arr, id, null);
        return result.parent;
      },

      findFistParent: function (arr, id, parent) {
        var result = {
          flag: false,
          parent: null,
        };
        for (let node of arr) {
          if (node.id == id) {
            result = {
              flag: true,
              parent: parent,
            };
            break;
          } else {
            if (node.children != null && node.children.length > 0) {
              result = Vue.prototype.$Util.findTreeParent(
                node.children,
                id,
                node
              );
              if (result.flag) {
                result = {
                  flag: true,
                  parent: node,
                };
                break;
              }
            }
          }
        }
        return result;
      },

      //获取url参数
      getQueryString: function (name) {
        //获取url后用"?"分割域名和参数，再进行查找
        let search =
          // search ||
          // window.location.search.substr(1) ||
          window.location.hash.split("?")[1];
        if (search) {
          let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
          let r = search.match(reg);
          if (r != null) return unescape(r[2]);
          return null;
        }
      },
    };
  },
};
