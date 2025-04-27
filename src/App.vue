<script setup lang="ts">
// @ts-ignore
import {ref} from "vue";
import {Plus, WarningFilled, Delete} from "@element-plus/icons-vue";
import {RecordTypes} from "@/assets/globalConstants";

interface Fields {
  id: number,
  label?: string,
  type: number;
  login: string,
  pass: string,
}

const datas = ref<Fields[]>([{id: 0, label: 'МеткаХХХ', type: 10, login: 'Значение1', pass: '73273'},
  {id: 1, label: 'МеткаYYY', type: 20, login: 'Логин2', pass: '73273'}])

function deleteRow(row: Fields) {
  datas.value = datas.value.filter(el => el.id !== row.id)
}

</script>

<template>
  <div class="content">
    <div>
      <h3>Учеьтные записи
        <el-button style="height: 40px; margin-left: 10px" :icon="Plus"></el-button>
      </h3>
      <div class="notice">
        <el-icon>
          <WarningFilled/>
        </el-icon>
        Для уазания нескольких меток для одной пары логин/пароль используйте разделитель ;
      </div>

      <table class="table">
        <tr>
          <th>
            Метки
          </th>
          <th>
            Тип записи
          </th>
          <th>
            Логин
          </th>
          <th>
            Парлоь
          </th>
          <th>
          </th>
        </tr>
        <tr v-for="el in datas">
          <td>
            <el-input v-model="el.label"/>
          </td>
          <td>
            <el-select
                style="width: 150px; margin-right: -26px"
                placeholder="Выберите бренд"
                v-model="el.type"
            >
              <el-option v-for="type in RecordTypes" :key="type.id" :label="type.name" :value="type.id"/>
            </el-select>

          </td>
          <td>
            <el-input maxlength="100" v-model="el.login"/>
          </td>
          <td>
            <el-input maxlength="100" v-model="el.pass"/>
          </td>
          <td style="width: 30px">
            <el-icon style="cursor: pointer">
              <Delete @click="deleteRow(el)"/>
            </el-icon>
          </td>
        </tr>


      </table>

    </div>
  </div>
</template>

