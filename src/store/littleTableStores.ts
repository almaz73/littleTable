import {defineStore} from "pinia";
// import {TableFields} from "@/assets/interfaces"; // нужно разобраться, почему не импортирует

interface TableFields {
    id: number,
    label?: string,
    type: number | null;
    q_Login: string,
    q_Pass: string,
}

function imitationServerGet() {
    let old:string|null = localStorage.getItem('littleTable')
    return JSON.parse(old)
}

function imitationServerPut(obj: TableFields) {
    
    console.log('obj = ',obj)
    // получаем старый массив, добавляем к нему строку и сохраянем вместе
    let old = imitationServerGet()
    let newTable = old || []

    let row = old && old.find((el: TableFields) => el.id == obj.id)
    console.log('row = ', row)

    if (!row) newTable.push(obj)
    else newTable = newTable.map((el: TableFields) => {
        if (el.id == obj.id) el = obj
        return el
    })
    
    console.log('newTable = ',newTable)

    localStorage.setItem('littleTable', JSON.stringify(newTable))
}

function imitationServerDelete(obj: TableFields[]) {
    localStorage.setItem('littleTable', JSON.stringify(obj))
}

export const useLittleTableStores = defineStore("littleTableStores", {
    state: () => ({
        list: []
    }),
    actions: {
        async readTable() {
            return await imitationServerGet()
        },
        async saveTable(row: TableFields) {
            return await imitationServerPut(row)
        },
        async deleteRow(datas:TableFields[]) {
            imitationServerDelete(datas)
        },
    }
})