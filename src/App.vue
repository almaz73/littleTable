<script setup lang="ts">
// @ts-ignore
import {ref} from "vue";
import {Plus, WarningFilled, Delete} from "@element-plus/icons-vue";
import {RecordTypes} from "@/assets/globalConstants";
import {useLittleTableStores} from "@/store/littleTableStores";
import {TableFields} from "@/assets/interfaces";


const littleTableStores = useLittleTableStores()
const datas = ref<TableFields[]>([{
  id: 0,
  label: 'МеткаХХХ МеткаХХХ МеткаХХХ МеткаХХХ МеткаХХХ',
  type: 10,
  login: 'Значение1',
  pass: '73273'
},
  {id: 1, label: 'МеткаYYY', type: 20, login: 'Логин2', pass: '73273'}])

const getLastId = function () {
  let lastId = 0
  datas.value.forEach((el: TableFields) => lastId = el.id > lastId ? el.id : lastId)
  return lastId
}

function addRow() {
  datas.value.push({id: getLastId() + 1, label: '', type: null, login: '', pass: ''})
}

function deleteRow(row: TableFields) {
  datas.value = datas.value.filter(el => el.id !== row.id)
}

</script>

<template>
  <div class="content">
    <div>
      <h3>Учеьтные записи
        <el-button style="height: 40px; margin-left: 10px" :icon="Plus" @click="addRow()"></el-button>
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
            <el-input placeholder="Введите метку" v-model="el.label"/>
          </td>
          <td>
            <el-select
                placeholder="Введите тип"
                style="width: 150px; margin-right: -26px"
                v-model="el.type"
            >
              <el-option v-for="type in RecordTypes" :key="type.id" :label="type.name" :value="type.id"/>
            </el-select>

          </td>
          <td>
            <el-input
                placeholder="Введите логин"
                maxlength="100" v-model="el.login"/>
          </td>
          <td>
            <el-input
                placeholder="Введите парль"
                maxlength="100" v-model="el.pass"/>
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

