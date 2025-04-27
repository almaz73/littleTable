<script setup lang="ts">
// @ts-ignore
import {onMounted, ref} from "vue";
import {Plus, WarningFilled, Delete} from "@element-plus/icons-vue";
import {RecordTypes} from "@/assets/globalConstants";
import {useLittleTableStores} from "@/store/littleTableStores";
import {TableFields} from "@/assets/interfaces";
import {ElMessage, ElMessageBox} from "element-plus";

const isEditMode = ref(false)
const isDirty = ref(false)
const newId = ref<number | null>()
const littleTableStores = useLittleTableStores()
const datas = ref<TableFields[]>([])

const getLastId = function () {
  let lastId = 0
  datas.value && datas.value.forEach((el: TableFields) => lastId = el.id > lastId ? el.id : lastId)
  return lastId + 1
}

onMounted(() => {
  littleTableStores.readTable().then(res => {
    datas.value = res
    console.log('res = ',res)
  })
})

function checkValids(id:number) {

  console.log('id = ',id)
  
  let record = datas.value.find((el: TableFields) => el.id == id)
  
  console.log('record = ',record)
  
  if (record && record.q_Login && record.q_Pass) {
    littleTableStores.saveTable(record).then(res => {
      ElMessage.success('Изменения сохранены!')
      initState()
    })

  }
  isDirty.value = true
}

function initState() {
  newId.value = null
  isDirty.value = false
  isEditMode.value = false
}

function addRow() {
  isDirty.value = false
  newId.value = getLastId()
  
  console.log('newId.value = ',newId.value)
  
  let newRow = {id: newId.value, label: '', type: null, q_Login: '', q_Pass: ''}
  if (datas.value) datas.value.push(newRow)
  else datas.value = [newRow]
  isEditMode.value = true
}

function deleteRow(row: TableFields) {
  ElMessageBox.confirm('Вы действительно хотите удалить?', 'Внимание', {
    confirmButtonText: 'Да',
    cancelButtonText: 'Нет'
  })
      .then(res => {
        console.log('res = ', res)
        if (isEditMode.value && newId.value == row.id) {
          initState()

        }

        datas.value = datas.value.filter(el => el.id !== row.id)
        littleTableStores.deleteRow(datas.value)
      })
      .catch(() => {
      })
}

</script>

<template>
  <div class="content">
    <div>
      <h3>Учетные записи
        <el-button :disabled="isEditMode" style="height: 40px; margin-left: 10px" :icon="Plus"
                   @click="addRow()"></el-button>
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
        <tr v-for="el in datas" @change="checkValids(el.id)">
          <td>
            <el-input
                :disabled="isEditMode && el.id!=newId"
                placeholder="Введите метку" maxlength="50" v-model="el.label"/>
          </td>
          <td>
            <el-select
                :disabled="isEditMode && el.id!=newId"
                @change="checkValids(el.id)"
                placeholder="Введите тип"
                style="width: 150px; margin-right: -26px"
                v-model="el.type"
            >
              <el-option v-for="type in RecordTypes" :key="type.id" :label="type.name" :value="type.id"/>
            </el-select>
          </td>
          <td>
            <el-input
                :disabled="isEditMode && el.id!=newId"
                :class="{err: !el.q_Pass && isDirty && !el.q_Login}"
                placeholder="Введите логин"
                autocomplete="off"
                maxlength="100" v-model="el.q_Login"/>
          </td>
          <td>
            <el-input
                :disabled="isEditMode && el.id!=newId"
                :class="{err: !el.q_Pass && isDirty && !el.q_Pass}"
                placeholder="Введите парль"
                autocomplete="off"
                type="q_Password"
                maxlength="100" v-model="el.q_Pass"/>
          </td>
          <td style="width: 30px">
            <el-icon style="cursor: pointer">
              <Delete @click="deleteRow(el)"/>
            </el-icon>
          </td>
        </tr>


      </table>

      <div style="text-align: center; color: #999" v-if="!datas || !datas.length"> Нет данных</div>

      <div style="text-align: right; opacity: 0.2" title="По заданию этого не надо.">
        <el-button v-if="isDirty && isEditMode" type="success" :icon="Plus"> Сохранить изменения</el-button>
        <el-button v-if="isDirty&& isEditMode" type="danger" @click="deleteRow({id:newId})"> Отмена</el-button>
      </div>

    </div>
  </div>
</template>

