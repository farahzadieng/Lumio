import {describe,it,expect} from 'vitest';
import {dayKey,shiftDay,currentStreak,shouldGraduate,bestStreak,type Habit} from './habits';
const habit=(startDayKey='2026-01-01'):Habit=>({id:'a',title:'Walk',note:'',createdAtISO:'2026-01-01T00:00:00Z',startDayKey,status:'active'});
describe('daily habit rules',()=>{
 it('uses local date parts and day shifts across years',()=>{expect(dayKey(new Date(2026,0,1,23,59))).toBe('2026-01-01');expect(shiftDay('2026-01-01',-1)).toBe('2025-12-31')});
 it('resets after a missed required day and preserves historical best',()=>{const days=['2026-01-01'];expect(currentStreak(habit(),days,'2026-01-03')).toBe(0);expect(bestStreak(habit(),days)).toBe(1)});
 it('graduates exactly on 21 consecutive check-ins',()=>{const days=Array.from({length:21},(_,i)=>shiftDay('2026-01-01',i));expect(shouldGraduate(habit(),days,'2026-01-21')).toBe(true);expect(shouldGraduate(habit(),days.slice(0,20),'2026-01-21')).toBe(false)});
 it('current streak may include yesterday before today is checked',()=>{expect(currentStreak(habit(),['2026-01-01','2026-01-02'],'2026-01-03')).toBe(2)});
});
