<template>
  <div class="login-container" :style="background">
    <div class="login-flex">
      <div class="login-flex__ui" style="flex: 0.55">
        <img src="@/assets/mdlogin/show.png" class="show-img" />
      </div>
      <div class="login-flex__ui" style="flex: 0.45">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <div class="title-container">
            <h3 class="title">保密室系统</h3>
          </div>

          <el-form-item prop="username" size="small">
            <el-input
              ref="username"
              v-model="loginForm.userName"
              placeholder="请输入账号"
              name="userName"
              type="text"
              tabindex="1"
              size="small"
              auto-complete="on"
            />
          </el-form-item>

          <el-form-item prop="password" size="small">
            <el-input
              ref="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              type="password"
              name="password"
              tabindex="2"
              size="small"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <!-- <span class="show-pwd" @click="showPwd"> </span> -->
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%; margin-bottom: 40px; margin-top: 44px"
            @click="handleLogin"
            >登 录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { loginApi } from "@/api/login";
import { login } from "@/api/data";
import Cookies from "js-cookie";
export default {
  name: "login",
  data() {
    return {
      background: {
        backgroundImage: "url(" + require("@/assets/mdlogin/bj.png") + ")",
      },
      loginForm: {
        userName: "",
        password: "",
      },
      loginRules: {
        userName: [
          {
            required: true,
            trigger: "blur",
            message: "请输入账号",
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: "请输入密码",
          },
        ],
      },
      loading: false,
    };
  },
  created() {},
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // login({ ...this.loginForm })
          loginApi({ ...this.loginForm })
            .then((res) => {
              this.loading = false;
              if (res.status === 200) {
                sessionStorage.setItem(
                  "loginUserData",
                  JSON.stringify(res.data)
                );
                // if (res) {
                //   this.$router.push({ path: "/equipment" });
                // }
                // this.$store.dispatch("login/userAuth").then((res) => {
                //       if (res?.length > 0) {
                //         this.$router.push({ path: "/equipment" });
                //       }
                //     });
                this.$store.dispatch("login/loginAction").then((res) => {
                  if (res) {
                    this.$store.dispatch("login/userAuth").then((res) => {
                      if (res?.length > 0) {
                        this.$router.push({ path: "/equipment" });
                      }
                    });
                  }
                });
              }
            })
            .catch((_) => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
// .el-form-item--small.el-form-item {
//   margin-bottom: 2px;
// }
.login-flex {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  // justify-items: center;
}
.login-flex__ui {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.show-img {
  width: calc(100vh * 0.67);
  height: calc(100vh * 0.67 * 0.7);
}

.login-container {
  background-color: $bg;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  display: flex;
  // justify-content: space-between;
  background-repeat: round;

  .login-form {
    // position: relative;
    width: 400px;
    padding: 52px 38px 42px 38px;
    overflow: hidden;
    background: white;
    border-radius: 8px;
    height: 380px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 22px;
      color: #00a0f0;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
      letter-spacing: 2px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.center-form {
  display: flex;
  justify-content: center;
  justify-items: center;
}
</style>
