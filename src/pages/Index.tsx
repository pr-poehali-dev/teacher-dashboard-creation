import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import Icon from '@/components/ui/icon';

interface Student {
  id: number;
  name: string;
  class: string;
  grades: number[];
  absences: { type: 'Н' | 'УП' | 'Б' | 'С'; count: number }[];
  average: number;
  isProblematic: boolean;
  notes: string;
}

interface GradeEntry {
  value: number;
  type: 'Домашняя работа' | 'Контрольная работа' | 'Самостоятельная работа';
  date: string;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedClass, setSelectedClass] = useState('9А');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock data
  const classes = ['9А', '9Б', '10А', '10Б', '11А'];
  const students: Student[] = [
    {
      id: 1,
      name: 'Иванов Иван',
      class: '9А',
      grades: [5, 4, 5, 3, 4],
      absences: [
        { type: 'Н', count: 2 },
        { type: 'УП', count: 1 },
        { type: 'Б', count: 3 },
        { type: 'С', count: 0 }
      ],
      average: 4.2,
      isProblematic: false,
      notes: 'Хорошо подготовлен к урокам'
    },
    {
      id: 2,
      name: 'Петрова София',
      class: '9А',
      grades: [3, 2, 3, 3, 2],
      absences: [
        { type: 'Н', count: 5 },
        { type: 'УП', count: 0 },
        { type: 'Б', count: 1 },
        { type: 'С', count: 0 }
      ],
      average: 2.6,
      isProblematic: true,
      notes: 'Требует дополнительного внимания'
    },
    {
      id: 3,
      name: 'Сидоров Максим',
      class: '9Б',
      grades: [5, 5, 4, 5, 5],
      absences: [
        { type: 'Н', count: 0 },
        { type: 'УП', count: 2 },
        { type: 'Б', count: 0 },
        { type: 'С', count: 1 }
      ],
      average: 4.8,
      isProblematic: false,
      notes: 'Отличник, активно участвует'
    }
  ];

  const handleLogin = () => {
    if (password === '123456789') {
      setIsAuthenticated(true);
    } else {
      alert('Неверный пароль!');
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 5) return 'text-green-600';
    if (grade >= 4) return 'text-blue-600';
    if (grade >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAbsenceColor = (type: string) => {
    switch (type) {
      case 'Н': return 'bg-red-100 text-red-800';
      case 'УП': return 'bg-green-100 text-green-800';
      case 'Б': return 'bg-blue-100 text-blue-800';
      case 'С': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <Icon name="GraduationCap" size={32} className="text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Личный кабинет учителя
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Пароль</label>
              <Input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="h-12"
              />
            </div>
            <Button 
              onClick={handleLogin}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            >
              Войти в систему
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredStudents = students.filter(student => student.class === selectedClass);
  const classStats = {
    totalStudents: filteredStudents.length,
    averageGrade: filteredStudents.reduce((sum, s) => sum + s.average, 0) / filteredStudents.length,
    problematicStudents: filteredStudents.filter(s => s.isProblematic).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Icon name="GraduationCap" size={28} className="text-blue-500" />
              <h1 className="text-xl font-bold text-gray-900">Кабинет учителя</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Онлайн
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAuthenticated(false)}
              >
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Icon name="Home" size={16} />
              <span>Главная</span>
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center space-x-2">
              <Icon name="Users" size={16} />
              <span>Классы</span>
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center space-x-2">
              <Icon name="BookOpen" size={16} />
              <span>Журнал</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <Icon name="FileText" size={16} />
              <span>Отчеты</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} />
              <span>Календарь</span>
            </TabsTrigger>
            <TabsTrigger value="constructor" className="flex items-center space-x-2">
              <Icon name="Settings" size={16} />
              <span>Конструктор</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} />
              <span>Статистика</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Icon name="Cog" size={16} />
              <span>Настройки</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Всего учеников</p>
                      <p className="text-3xl font-bold">{students.length}</p>
                    </div>
                    <Icon name="Users" size={32} className="text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Средний балл</p>
                      <p className="text-3xl font-bold">
                        {(students.reduce((sum, s) => sum + s.average, 0) / students.length).toFixed(1)}
                      </p>
                    </div>
                    <Icon name="TrendingUp" size={32} className="text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100">Проблемные</p>
                      <p className="text-3xl font-bold">
                        {students.filter(s => s.isProblematic).length}
                      </p>
                    </div>
                    <Icon name="AlertTriangle" size={32} className="text-yellow-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Классов</p>
                      <p className="text-3xl font-bold">{classes.length}</p>
                    </div>
                    <Icon name="School" size={32} className="text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={20} className="text-red-500" />
                    <span>Проблемные ученики</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {students.filter(s => s.isProblematic).map(student => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium text-red-900">{student.name}</p>
                          <p className="text-sm text-red-600">Класс {student.class} • Средний балл: {student.average}</p>
                        </div>
                        <Badge variant="destructive">Внимание</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Calendar" size={20} className="text-blue-500" />
                    <span>Сегодняшние занятия</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900">Математика - 9А</p>
                        <p className="text-sm text-blue-600">10:00 - 10:45</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Сейчас</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Алгебра - 10Б</p>
                        <p className="text-sm text-gray-600">11:00 - 11:45</p>
                      </div>
                      <Badge variant="outline">Следующий</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Classes */}
          <TabsContent value="classes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Управление классами</h2>
              <div className="flex items-center space-x-4">
                <select 
                  value={selectedClass} 
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                <Button className="bg-green-500 hover:bg-green-600">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить ученика
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Ученики класса {selectedClass}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredStudents.map(student => (
                      <div key={student.id} className={`p-4 rounded-lg border-2 ${student.isProblematic ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-lg">{student.name}</h3>
                              {student.isProblematic && (
                                <Badge variant="destructive" className="text-xs">
                                  <Icon name="AlertTriangle" size={12} className="mr-1" />
                                  Проблемный
                                </Badge>
                              )}
                            </div>
                            <div className="mt-2 flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Средний балл:</span>
                                <Badge className={`${student.average >= 4 ? 'bg-green-100 text-green-800' : student.average >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                  {student.average}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-1">
                                {student.absences.map((absence, idx) => (
                                  <Badge key={idx} variant="outline" className={`text-xs ${getAbsenceColor(absence.type)}`}>
                                    {absence.type}: {absence.count}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {student.grades.map((grade, idx) => (
                                <span key={idx} className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold bg-gray-100 ${getGradeColor(grade)}`}>
                                  {grade}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Icon name="Edit" size={16} />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Статистика класса {selectedClass}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Всего учеников</span>
                      <span className="font-semibold">{classStats.totalStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Средний балл</span>
                      <span className="font-semibold">{classStats.averageGrade.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Проблемные</span>
                      <span className="font-semibold text-red-600">{classStats.problematicStudents}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Успеваемость</h4>
                    <Progress value={(classStats.averageGrade / 5) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Journal */}
          <TabsContent value="journal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="BookOpen" size={20} />
                  <span>Электронный журнал</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Icon name="BookOpen" size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Журнал в разработке</h3>
                  <p className="text-gray-600">Здесь будет система выставления оценок</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="FileText" size={20} />
                  <span>Отчеты и экспорт</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Отчет по классу</h3>
                    <p className="text-sm text-gray-600 mb-4">Экспорт успеваемости класса в PDF</p>
                    <Button className="w-full">
                      <Icon name="Download" size={16} className="mr-2" />
                      Скачать PDF
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Индивидуальные отчеты</h3>
                    <p className="text-sm text-gray-600 mb-4">Отчеты по каждому ученику</p>
                    <Button className="w-full" variant="outline">
                      <Icon name="FileText" size={16} className="mr-2" />
                      Создать отчеты
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar */}
          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Календарь занятий</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Расписание на сегодня</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Математика</p>
                          <p className="text-sm text-gray-600">9А класс</p>
                        </div>
                        <Badge>10:00-10:45</Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Алгебра</p>
                          <p className="text-sm text-gray-600">10Б класс</p>
                        </div>
                        <Badge>11:00-11:45</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Constructor */}
          <TabsContent value="constructor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="Settings" size={20} />
                  <span>Конструктор контрольных работ</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Icon name="Settings" size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Конструктор в разработке</h3>
                  <p className="text-gray-600">Здесь будет система создания контрольных работ</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Общая статистика</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {classes.map(cls => {
                    const classStudents = students.filter(s => s.class === cls);
                    const avgGrade = classStudents.length > 0 
                      ? classStudents.reduce((sum, s) => sum + s.average, 0) / classStudents.length 
                      : 0;
                    
                    return (
                      <div key={cls} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Класс {cls}</span>
                          <span className="text-sm text-gray-600">{avgGrade.toFixed(1)}</span>
                        </div>
                        <Progress value={(avgGrade / 5) * 100} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Распределение оценок</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[5, 4, 3, 2].map(grade => {
                      const count = students.reduce((sum, student) => 
                        sum + student.grades.filter(g => g === grade).length, 0
                      );
                      const total = students.reduce((sum, student) => sum + student.grades.length, 0);
                      const percentage = total > 0 ? (count / total) * 100 : 0;
                      
                      return (
                        <div key={grade} className="flex items-center space-x-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${getGradeColor(grade)} bg-gray-100`}>
                            {grade}
                          </span>
                          <div className="flex-1">
                            <Progress value={percentage} className="h-2" />
                          </div>
                          <span className="text-sm text-gray-600 w-12">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="Cog" size={20} />
                  <span>Настройки системы</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Icon name="Cog" size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Настройки в разработке</h3>
                  <p className="text-gray-600">Здесь будут системные настройки</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;