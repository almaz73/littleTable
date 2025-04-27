<script setup lang="ts">
// @ts-ignore
import {onMounted, ref} from "vue";
import {Plus, WarningFilled, Delete, View, Hide} from "@element-plus/icons-vue";
import {RecordTypes} from "@/assets/globalConstants";
import {useLittleTableStores} from "@/store/littleTableStores";
import {TableFields} from "@/assets/interfaces";
import {ElMessage, ElMessageBox} from "element-plus";

const isEditMode = ref(false)
const isDirty = ref(false)
const newId = ref<number | null>()
const littleTableStores = useLittleTableStores()
const datas = ref<TableFields[]>([])
const passView = ref<number | null>(null); // id поля чтобы отобразить пароль

const getLastId = function () {
  let lastId = 0
  datas.value && datas.value.forEach((el: TableFields) => lastId = el.id > lastId ? el.id : lastId)
  return lastId + 1
}

onMounted(() => {
  littleTableStores.readTable().then(res => {
    datas.value = res.map((el: TableFields) => {
      if (el.labelArr) el.label = el.labelArr.join('; ')
      return el
    })
  })
})

function typeChanged(row: TableFields) {
  row.pass = ''
  checkValids(row.id)
}

function checkValids(id: number) {

  let record = datas.value.find((el: TableFields) => el.id == id)
  if (record && record.label) record.labelArr = record.label.split(';')

  if (record && record.login && (((record.type == 20 || !record.type) && record.pass) || record.type == 10)) {
    littleTableStores.saveTable(record).then(() => {
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
  passView.value = null
}

function addRow() {
  isDirty.value = false
  newId.value = getLastId()
  let newRow = {id: newId.value, label: '', type: null, login: '', pass: ''}
  if (datas.value) datas.value.push(newRow)
  else datas.value = [newRow]
  isEditMode.value = true
}

function deleteRow(row: TableFields) {
  ElMessageBox.confirm('Вы действительно хотите удалить?', 'Внимание', {
    confirmButtonText: 'Да',
    cancelButtonText: 'Нет'
  })
      .then(() => {
        if (isEditMode.value && newId.value == row.id) initState()

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
        <el-button
            size="large"
            :disabled="isEditMode"
            style="margin-left: 10px; padding: 8px 14px" :icon="Plus"
            @click="addRow()">
        </el-button>
      </h3>
      <div class="notice">
        <el-icon>
          <WarningFilled/>
        </el-icon>
        Для уазания нескольких меток для одной пары логин/пароль используйте разделитель " ; "
      </div>

      <table class="table">
        <tr>
          <th> Метки</th>
          <th> Тип записи</th>
          <th> Логин</th>
          <th> Парлоь</th>
          <th></th>
        </tr>
        <tr v-for="el in datas" @change="checkValids(el.id)">
          <td>
            <el-input
                class="labeltextArea"
                :type="el.label && el.label.length>30?'textarea':''"
                :disabled="isEditMode && el.id!==newId"
                placeholder="метка" maxlength="50" v-model="el.label"/>
          </td>
          <td>
            <el-select
                :disabled="isEditMode && el.id!==newId"
                @change="typeChanged(el)"
                placeholder="тип"
                style="width: 150px; margin-right: -26px"
                v-model="el.type"
            >
              <el-option v-for="type in RecordTypes" :key="type.id" :label="type.name" :value="type.id"/>
            </el-select>
          </td>
          <td :colspan="el.type===10?2:1">
            <el-input
                :disabled="isEditMode && el.id!==newId"
                :class="{err: !el.pass && isDirty && !el.login}"
                placeholder="Введите логин"
                autocomplete="off"
                maxlength="100" v-model="el.login"/>
          </td>
          <td v-if="el.type!==10">
            <div style="position: relative;">
              <el-input
                  :disabled="isEditMode && el.id!==newId"
                  :class="{err: !el.pass && isDirty && !el.pass}"
                  placeholder="Введите парль"
                  autocomplete="false"
                  readonly
                  onfocus="this.removeAttribute('readonly');"
                  :type="passView!==el.id?'password':''"
                  maxlength="100" v-model="el.pass"/>

              <div class="eyes">
                <el-icon v-if="passView!==el.id" @click="passView=el.id">
                  <View/>
                </el-icon>
                <el-icon v-if="passView===el.id" @click="passView=null">
                  <Hide/>
                </el-icon>
              </div>
            </div>
          </td>
          <td style="width: 20px; text-align: right; opacity: 0.5">
            <el-icon style="cursor: pointer" size="large">
              <Delete @click="deleteRow(el)"/>
            </el-icon>
          </td>
        </tr>


      </table>

      <div style="text-align: center; color: #999" v-if="!datas || !datas.length"> Нет данных</div>

      <!--      <div style="text-align: right; opacity: 0.2" title="По заданию этого не надо.">-->
      <!--        <el-button v-if="isDirty && isEditMode" type="success" :icon="Plus"> Сохранить изменения</el-button>-->
      <!--        <el-button v-if="isDirty&& isEditMode" type="danger" @click="deleteRow({id:newId})"> Отмена</el-button>-->
      <!--      </div>-->

      <br>
      <div style="font-family: Verdana, Arial">
        Данные сохраняются в localStorage.<br>
        В Pinia происходит имитация ассинхронного обращения к серверу.<br>
        В консоле выводится визуализация получаемых и отправляемых данных.<br>
        Не было сказано редактируются ли уже сохраненные поля - тут редактируются
      </div>

    </div>
  </div>
</template>

