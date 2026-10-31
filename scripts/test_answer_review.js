const assert=require('node:assert/strict'),review=require('../assets/js/answer-review');
const q=(id,kind='domain',dimension='domain.math')=>({id,kind,dimension,measurement:'independent-rating',options:[{key:'1',rating:0},{key:'3',rating:.5},{key:'5',rating:1},{key:'U',rating:null}]});
const questions=[q('a'),q('b'),q('c','domain','domain.biology'),q('d','domain','domain.biology')];
assert.deepEqual(review.analyze(questions,{a:'3',b:'3',c:'3',d:'3'}).signals,[]);
assert.deepEqual(review.analyze(questions,{a:'5',b:'5',c:'5',d:'5'}).signals,[]); // Identical answers are allowed.
const sparse=review.analyze(questions,{a:'U',b:'U',c:'3',d:'3'});assert(sparse.signals.includes('limited_information'));assert.equal(sparse.missingCount,0);
const split=review.analyze(questions,{a:'1',b:'5',c:'3',d:'3'});assert.deepEqual(split.signals,['different_task_ratings']);assert.deepEqual(split.reviewIds,['a','b']);
assert.equal(review.analyze(questions,{a:'bad'}).missingCount,4);
const many=Array.from({length:30},(_,i)=>q(String(i),'domain','domain.math')),answers=Object.fromEntries(many.map(x=>[x.id,'3']));
assert(review.analyze(many,answers,{activeSeconds:30}).signals.includes('short_active_time'));
assert(!review.analyze(many,answers,{activeSeconds:0}).signals.includes('short_active_time'));
assert(!review.note(split));assert(review.note(sparse));
// Submit gate must not create/consume a report until the student confirms the current answers.
const harness=require('./lib/assessment_harness').createAssessmentHarness(),{run,nodes}=harness;
run(`answers={};applyMode('full');calibrationAdded=true;followUpAdded=true;for(const q of activeQuestions)answers[q.id]=q.kind==='domain'?'U':q.options[2]?.key || q.options[0].key;`);
const submit=()=>nodes.get('quiz-form').listeners.submit({preventDefault(){}});
submit();assert.equal(run('activeReportRecord'),null);assert(!nodes.get('answer-review').classList.contains('hidden'));
run('acceptedReviewFingerprint=pendingReviewFingerprint');submit();assert(run('Boolean(activeReportRecord?.payload.id)'));
assert(run("activeReportRecord.payload.inputReview.reviewed"));
console.log('PASS: unknown versus omitted answers, non-judgmental task difference/short-time review, same-answer allowance and pre-submit gate');
