import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUfpStore = defineStore("ufpStore", () => {
  // 定义五个响应式值
  const EO = ref<number>(1);
  const EI = ref<number>(1);
  const EQ = ref<number>(1);
  const ILF = ref<number>(1);
  const EIF = ref<number>(1);

  // 计算属性：计算总和（可选）
  const total = computed(() => EO.value + EI.value + EQ.value + ILF.value + EIF.value);

  // 修改方法
  const setEO = (value: number) => {
    EO.value = value;
  };
  const setEI = (value: number) => {
    EI.value = value;
  };
  const setEQ = (value: number) => {
    EQ.value = value;
  };
  const setILF = (value: number) => {
    ILF.value = value;
  };
  const setEIF = (value: number) => {
    EIF.value = value;
  };

  // 导出 state 和方法
  return {
    EO,
    EI,
    EQ,
    ILF,
    EIF,
    total,
    setEO,
    setEI,
    setEQ,
    setILF,
    setEIF,
  };
});
