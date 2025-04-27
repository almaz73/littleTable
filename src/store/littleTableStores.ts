import {defineStore} from "pinia";

// import {TableFields} from "@/assets/interfaces"; // нужно разобраться, почему не импортирует

interface TableFields {
    id: number,
    label?: string,
    labelArr?: string[],
    type?: number;
    login: string,
    pass: string,
}

function imitationServerGet() {
    // @ts-ignore
    let old: string = localStorage.getItem('littleTable')
    return JSON.parse(old)
}

function imitationServerPut(obj: TableFields) {
    // получаем старый массив, добавляем к нему строку и сохраянем вместе
    let old = imitationServerGet()
    let newTable = old || []

    let row = old && old.find((el: TableFields) => el.id == obj.id)

    if (!row) newTable.push(obj)
    else newTable = newTable.map((el: TableFields) => {
        if (el.id == obj.id) el = obj
        return el
    })

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
            let row = await imitationServerGet()
            console.log('%cОтвет от сервера = ' + JSON.stringify(row), 'background:pink; color: black')
            return row
        },
        async saveTable(row: TableFields) {
            delete row.label
            console.log('%cУходит на сервер = ' + JSON.stringify(row), 'background:green')
            return await imitationServerPut(row)
        },
        async deleteRow(datas: TableFields[]) {
            imitationServerDelete(datas)
        },
    }
})