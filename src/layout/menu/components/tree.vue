<template>
  <div class="tree">
    <el-row :gutter="7">
    <el-col :span="18">
      <el-input v-model="searchQuery" placeholder="请输入部门名称"></el-input>
    </el-col>
    <br>
    <br>
    <el-col :span="1">
      <el-button type="primary" @click="searchDepartments"><el-icon><Search /></el-icon></el-button>
    </el-col>
  </el-row>
    <el-tree
      style="max-width: 600px"
      :data="filteredTreeData"
      :props="defaultProps"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Tree {
  label: string;
  children?: Tree[];
}

const treeData = ref<Tree[]>([]);
const filteredTreeData = ref<Tree[]>([]);
const searchQuery = ref('');

const handleNodeClick = (data: Tree) => {
  console.log(data);
};

const defaultProps = {
  children: 'children',
  label: 'label',
};

const fetchCompanies = async () => {
  try {
    //获取公司列表
    const response = await axios.get('http://localhost:8088/companies/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};

const fetchUsersByCompanyId = async (companyId: number) => {
  try {
    //根据公司id在用户表中获取对应部门
    const response = await axios.get(`http://localhost:8088/users/company/${companyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching users for companyId ${companyId}:`, error);
    return [];
  }
};

const buildTreeData = async () => {
  const companies = await fetchCompanies();
  
  const treeNodes: Tree[] = await Promise.all(
    companies.map(async (company: any) => {
      const users = await fetchUsersByCompanyId(company.companyId);
      const departmentSet = new Set();
      
      const departments = users.reduce((acc: Tree[], user: any) => {
        if (!departmentSet.has(user.department)) {
          departmentSet.add(user.department);
          acc.push({ label: user.department });
        }
        return acc;
      }, []);
      
      return {
        label: company.companyName,
        children: departments,
      };
    })
  );
  
  treeData.value = [
    {
      label: '测盟汇',
      children: treeNodes,
    },
  ];

  filteredTreeData.value = treeData.value;
};

const searchTree = (nodes: Tree[]): Tree[] => {
  return nodes
    .map(node => {
      if (node.children) {
        const matchedChildren = searchTree(node.children);
        if (matchedChildren.length > 0 || node.label.includes(searchQuery.value)) {
          return {
            ...node,
            children: matchedChildren,
          };
        }
      }
      // console.log("hello"+searchQuery.value)
      // console.log("node.label"+node.label)
      if (node.label.includes(searchQuery.value)) {
        return { ...node };
      }
      return null;
    })
    .filter(node => node !== null);
};

const searchDepartments = () => {
  if (!searchQuery.value) {
    filteredTreeData.value = treeData.value;
    return;
  }
  filteredTreeData.value = searchTree(treeData.value);
};

onMounted(buildTreeData);
</script>

<style>
.tree{
  margin-top: 13px
}
</style>
