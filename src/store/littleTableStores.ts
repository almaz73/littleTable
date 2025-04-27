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
    // получаем старый массив, добавляем к нему строку и сохраянем вместе
    let old = imitationServerGet()
    let newTable = old || []
    newTable.push(obj)
    return localStorage.setItem('littleTable', JSON.stringify(newTable))
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