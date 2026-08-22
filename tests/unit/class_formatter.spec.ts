import { test } from '@japa/runner'
import {
  formatRpmClassCover,
  formatRpmClassGroupDetail,
  formatSchoolClassName,
} from '#services/class_formatter'

test.group('Class Formatter Service', () => {
  test('formats cover string for RA with rombel number and nickname', ({ assert }) => {
    const res = formatRpmClassCover({
      name: 'Ibrahim',
      gradeLevel: 1,
      groupContext: 'b',
      rombelNumber: '1',
    })
    assert.equal(res, 'RA / B1 (IBRAHIM)')
  })

  test('formats cover string for RA with rombel number without nickname', ({ assert }) => {
    const res = formatRpmClassCover({
      name: 'B1',
      gradeLevel: 1,
      groupContext: 'b',
      rombelNumber: '1',
    })
    assert.equal(res, 'RA / B1')
  })

  test('formats cover string for RA Kelompok A with nickname', ({ assert }) => {
    const res = formatRpmClassCover({
      name: 'Mawar',
      gradeLevel: 0,
      groupContext: 'a',
      rombelNumber: '2',
    })
    assert.equal(res, 'RA / A2 (MAWAR)')
  })

  test('formats group detail string with compact code and age range', ({ assert }) => {
    const res = formatRpmClassGroupDetail({
      name: 'Ibrahim',
      gradeLevel: 1,
      groupContext: 'b',
      rombelNumber: '1',
    })
    assert.equal(res, 'B1 / 5-6 Tahun')
  })

  test('formats group detail string without duplicate nickname', ({ assert }) => {
    const res = formatRpmClassGroupDetail({
      name: 'B1',
      gradeLevel: 1,
      groupContext: 'b',
      rombelNumber: '1',
    })
    assert.equal(res, 'B1 / 5-6 Tahun')
  })

  test('formats school class display name for SD/MI', ({ assert }) => {
    const res = formatSchoolClassName(
      {
        name: 'A',
        gradeLevel: 4,
      },
      'sd'
    )
    assert.equal(res, 'Kelas 4A')
  })
})
